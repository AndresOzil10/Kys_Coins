// hooks/useProposalLock.js
import { useState, useEffect, useCallback } from 'react'

const useProposalLock = (baseUrl) => {
  const [locks, setLocks] = useState({})
  const [userSessionId, setUserSessionId] = useState('')
  const [isInitialized, setIsInitialized] = useState(false)

  // Generar o recuperar ID de sesión
  const getSessionId = () => {
    let sessionId = localStorage.getItem('user_session_id')
    
    if (!sessionId) {
      // Generar ID único de sesión
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}_${navigator.userAgent.substring(0, 50)}`
      localStorage.setItem('user_session_id', sessionId)
      
      // También guardar en sessionStorage para la pestaña actual
      sessionStorage.setItem('current_session_id', sessionId)
    }
    
    // Guardar también nombre de usuario si está disponible
    const userName = localStorage.getItem('user_name') || 'Usuario'
    localStorage.setItem('current_user_name', userName)
    
    return sessionId
  }

  // Inicializar sesión
  useEffect(() => {
    if (!isInitialized) {
      const sessionId = getSessionId()
      setUserSessionId(sessionId)
      setIsInitialized(true)
      
      // Sincronizar bloqueos al inicio
      syncLocks()
      
      // Configurar heartbeat para mantener bloqueos activos
      const heartbeatInterval = setInterval(() => {
        Object.keys(locks).forEach(async (proposalId) => {
          if (locks[proposalId]?.sessionId === sessionId) {
            await renewLock(proposalId)
          }
        })
      }, 60000) // Cada minuto
      
      // Limpiar al desmontar
      return () => {
        clearInterval(heartbeatInterval)
        // Liberar todos los bloqueos de esta sesión
        releaseAllLocks()
      }
    }
  }, [isInitialized])

  // Sincronizar bloqueos desde el servidor
  const syncLocks = async () => {
    try {
      const response = await fetch(baseUrl)
      if (response.ok) {
        const serverLocks = await response.json()
        setLocks(serverLocks)
      }
    } catch (error) {
      console.error('Error al sincronizar bloqueos:', error)
    }
  }

  // Verificar si una propuesta está bloqueada
  const isProposalLocked = useCallback((proposalId) => {
    const lock = locks[proposalId]
    if (!lock) return false
    
    // Verificar si el bloqueo expiró
    if (lock.expiresAt) {
      const now = new Date().getTime()
      const expiresAt = new Date(lock.expiresAt).getTime()
      
      if (now > expiresAt) {
        return false
      }
    }
    
    // Verificar si es del mismo usuario
    return lock.sessionId !== userSessionId
  }, [locks, userSessionId])

  // Obtener información del bloqueo
  const getLockInfo = useCallback((proposalId) => {
    const lock = locks[proposalId]
    if (!lock || lock.sessionId === userSessionId) return null
    
    return {
      userName: lock.userName || 'Otro usuario',
      lockedAt: lock.timestamp,
      expiresAt: lock.expiresAt
    }
  }, [locks, userSessionId])

  // Bloquear una propuesta
  const lockProposal = async (proposalId, userName) => {
    if (!userSessionId) return false

    const lockData = {
      aksi: "lock_proposal",
      proposalId,
      sessionId: userSessionId,
      userName,
      userId: localStorage.getItem('user_id') || null
    }
    console.log('Intentando bloquear propuesta:', lockData)
    try {
      const response = await fetch(baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(lockData)
      })

      const result = await response.json()
      
      if (result.success) {
        // Actualizar estado local
        setLocks(prev => ({
          ...prev,
          [proposalId]: {
            sessionId: userSessionId,
            userName: lockData.userName,
            timestamp: new Date().toISOString(),
            expiresAt: result.expiresAt || new Date(Date.now() + 5 * 60000).toISOString()
          }
        }))
        return true
      } else {
        console.warn('No se pudo bloquear:', result.message)
        return false
      }
    } catch (error) {
      console.error('Error al bloquear propuesta:', error)
      return false
    }
  }

  // Renovar un bloqueo
  const renewLock = async (proposalId) => {
    try {
      const response = await fetch(baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            aksi: "check_lock",
          proposalId,
          sessionId: userSessionId
        })
      })
      
      if (response.ok) {
        const result = await response.json()
        return result
      }
    } catch (error) {
      console.error('Error al renovar bloqueo:', error)
    }
    return null
  }

  // Liberar un bloqueo
  const releaseProposalLock = async (proposalId) => {
    if (!userSessionId) return

    try {
      await fetch(baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            aksi: "release_lock",
          proposalId,
          sessionId: userSessionId
        })
      })
    } catch (error) {
      console.error('Error al liberar bloqueo:', error)
    }

    // Remover del estado local
    setLocks(prev => {
      const newLocks = { ...prev }
      delete newLocks[proposalId]
      return newLocks
    })
  }

  // Liberar todos los bloqueos de esta sesión
  const releaseAllLocks = async () => {
    if (!userSessionId) return

    Object.keys(locks).forEach(async (proposalId) => {
      if (locks[proposalId]?.sessionId === userSessionId) {
        await releaseProposalLock(proposalId)
      }
    })
  }

  // Sincronizar periódicamente
  useEffect(() => {
    if (isInitialized) {
      const syncInterval = setInterval(syncLocks, 10000) // Cada 10 segundos
      return () => clearInterval(syncInterval)
    }
  }, [isInitialized])

  return {
    isProposalLocked,
    getLockInfo,
    lockProposal,
    releaseProposalLock,
    releaseAllLocks,
    userSessionId,
    syncLocks
  }
}

export default useProposalLock
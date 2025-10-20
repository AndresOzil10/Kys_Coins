import React from 'react'
import coins from '../../assets/png/coins_2.png'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

function Stat() {
  return (
    <>
        <div className=''>
        <div className="stats shadow-lg">
          <div className="stat">
            <div className="stat-figure text-green-500">
              <TrendingUpIcon />
            </div>
            <div className="stat-title">Actual Points</div>
            <div className="stat-value text-green-500">25.6K</div>
            <div className="stat-desc text-green-500">Total Points</div>
          </div>

          <div className="stat">
            <div className="stat-figure text-yellow-500">
              {/* <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-exclamation-diamond-fill" viewBox="0 0 16 16">
                <path d="M9.05.435c-.58-.58-1.52-.58-2.1 0L.436 6.95c-.58.58-.58 1.519 0 2.098l6.516 6.516c.58.58 1.519.58 2.098 0l6.516-6.516c.58-.58.58-1.519 0-2.098zM8 4c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995A.905.905 0 0 1 8 4m.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
              </svg> */}
              <WarningAmberIcon />
            </div>
            <div className="stat-title">Nearing Expiration</div>
            <div className="stat-value text-yellow-500">2.6M</div>
            <div className="stat-desc text-yellow-500">Proximos a vencer</div>
          </div>

          <div className="stat">
            <div className="stat-figure text-red-500">
              <TrendingDownIcon />
            </div>
            <div className="stat-title">Points Lost</div>
            <div className="stat-value text-red-500">2.6M</div>
            <div className="stat-desc text-red-500">Puntos Vencidos</div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Stat
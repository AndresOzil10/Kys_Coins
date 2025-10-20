import React from 'react'
import Stat from '../components/Personal/Stat'
import TableProposals from '../components/Personal/TableProposals'

function PuntosScreen() {
  return (
    <>
    <div  className='flex justify-center items-center mt-2 mb-2'>
      <Stat />
    </div>
    <TableProposals />
    </>
  )
}

export default PuntosScreen
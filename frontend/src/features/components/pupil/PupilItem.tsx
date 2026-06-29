import React from 'react'

interface PupilItemProps {
  firstname: string;
  lastname: string;
}

export const PupilItem:React.FC<PupilItemProps> = ({firstname, lastname}) => {
  return (
    <>
      <li>
        {firstname} {lastname}
      </li>
    </>
  )
}

import { Spin } from 'antd'
import React from 'react'

const Loading = () => {
  return (
    <div
      style={{
        display: 'grid',
        placeItems: 'center',
        gridTemplateRows: '100%',
      }}
    >
      <Spin size="large" />
    </div>
  )
}

export default Loading

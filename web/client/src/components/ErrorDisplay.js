import { Alert } from 'antd'
import React from 'react'

const ErrorDisplay = ({ error }) => {
  return (
    <div
      style={{
        display: 'grid',
        placeItems: 'center',
        gridTemplateRows: '100%',
      }}
    >
      <Alert
        message="Error"
        description={
          error.response?.data?.message || error.message || error.toString()
        }
        type="error"
      />
    </div>
  )
}

export default ErrorDisplay

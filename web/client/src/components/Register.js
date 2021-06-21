import { Form, Input, Button, Alert, Modal } from 'antd'
import { useCallback, useState } from 'react'
import { useHistory } from 'react-router'
import AuthService from 'services/auth.service'

import { LoadingOutlined } from '@ant-design/icons'

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
}
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
}

const Register = () => {
  const [form] = Form.useForm()

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const history = useHistory()
  const onFinish = useCallback(
    ({ email, password, name, phone, orgName }) => {
      setMessage('')
      setLoading(true)

      AuthService.register(email, password, name, phone, orgName).then(
        () => {
          const modal = Modal.success({
            title: '회원가입을 완료하였습니다!',
            content: `확인을 클릭하면 로그인 화면으로 이동합니다.`,
            onOk: function () {
              history.replace('/login')
              modal.destroy()
            },
          })
        },
        (error) => {
          const resMessage =
            error.response?.data?.message || error.message || error.toString()
          setLoading(false)
          setMessage(resMessage)
        }
      )
    },
    [history]
  )

  return (
    <div style={{ height: '100vh', display: 'grid', placeItems: 'center' }}>
      <Form
        {...formItemLayout}
        form={form}
        name="register"
        onFinish={onFinish}
        scrollToFirstError
        style={{ width: '100%', maxWidth: 450 }}
      >
        <Form.Item
          name="email"
          label="이메일"
          rules={[
            {
              type: 'email',
              message: '이메일 형식이 올바르지 않습니다.',
            },
            {
              required: true,
              message: '이메일을 입력해주세요.',
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="password"
          label="비밀번호"
          rules={[
            {
              required: true,
              message: '비밀번호를 입력해 주십시오.',
            },
            () => ({
              validator(_, value) {
                if (
                  /(?=.*\d{1,50})(?=.*[~`!@#$%\\^&*()-+=\\.]{1,50})(?=.*[a-zA-Z]{2,50}).{8,50}$/.test(
                    value
                  ) === false
                ) {
                  return Promise.reject(
                    new Error(
                      '영문, 숫자, 특수문자 포함 8자이상 입력해 주십시오.'
                    )
                  )
                } else {
                  return Promise.resolve()
                }
              },
            }),
          ]}
          hasFeedback
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="confirm"
          label="비밀번호 확인"
          dependencies={['password']}
          hasFeedback
          rules={[
            {
              required: true,
              message: '비밀번호를 다시 입력해 주십시오.',
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve()
                }

                return Promise.reject(
                  new Error('비밀번호가 일치하지 않습니다!')
                )
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="name"
          label="이름"
          rules={[
            {
              required: true,
              message: '이름을 입력해 주십시오.',
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="phone"
          label="연락처"
          rules={[
            {
              required: true,
              message: '연락처를 입력해 주십시오.',
            },
            ({ setFieldsValue }) => ({
              validator(_, value) {
                const onlyNumberValue = value
                  .split('')
                  .filter((character) => /[0-9]/.test(character))
                  .join('')

                setFieldsValue({
                  phone: onlyNumberValue.replace(
                    /(^02.{0}|^01.{1}|[0-9]{3})([0-9]+)([0-9]{4})/,
                    '$1-$2-$3'
                  ),
                })
                return Promise.resolve()
              },
            }),
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="orgName"
          label="기관명"
          rules={[
            {
              required: true,
              message: '기관명을 입력해 주십시오.',
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit" disabled={loading}>
            {loading ? <LoadingOutlined /> : '가입완료'}
          </Button>
        </Form.Item>

        {message && <Alert message={message} type="error" />}
      </Form>
    </div>
  )
}

export default Register

import { useState, useCallback } from 'react'

import AuthService from 'services/auth.service'
import { useHistory } from 'react-router'
import { UserOutlined, LockOutlined, LoadingOutlined } from '@ant-design/icons'
import classnames from 'classnames/bind'

import styles from './Login.module.scss'
import { Button, Input, Form, Alert } from 'antd'
import { Link } from 'react-router-dom'

const cx = classnames.bind(styles)

const Login = () => {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const history = useHistory()
  const onFinish = useCallback(
    ({ email, password }) => {
      setMessage('')
      setLoading(true)

      AuthService.login(email, password).then(
        (data) => {
          if (data.orgs) {
            // 기관 메인 페이지로 이동(보스 시설장): 프로그램 한시적 임시 동작을 위한것임. 나중에 여러시설 관리 기능을 대비하기 위해 가능성을 열어두었음
            history.replace(`/${data.orgs[0].id}`)
          } else if (data.session) {
            history.replace(
              // 프로그램 메인 페이지로 이동 (사원)
              `/${data.session.orgId}/${data.session.program.name}`
            )
          } else {
            // 관리자 및 모더레이터, (유저가 여러 기관 추가하는 기능 개발될때 여기로 옮길것(보스))
            history.replace('/')
          }
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
    <div className={cx('container')}>
      <Form
        name="normal_login"
        className={cx('login-form')}
        initialValues={{ remember: true }}
        onFinish={onFinish}
      >
        <Form.Item
          name="email"
          rules={[
            {
              type: 'email',
              message: '이메일 형식이 올바르지 않습니다.',
            },
            { required: true, message: '이메일을 입력해 주십시오.' },
          ]}
        >
          <Input
            prefix={<UserOutlined className={cx('site-form-item-icon')} />}
            placeholder="이메일"
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: '비밀번호를 입력해 주십시오.' }]}
        >
          <Input
            prefix={<LockOutlined className={cx('site-form-item-icon')} />}
            type="password"
            placeholder="비밀번호"
          />
        </Form.Item>

        <Form.Item style={{ textAlign: 'center' }}>
          <Button
            type="primary"
            htmlType="submit"
            className={cx('login-form-button')}
          >
            {loading ? <LoadingOutlined /> : '로그인'}
          </Button>
          아이디가 없으시면? <Link to="/register">회원가입</Link>
        </Form.Item>

        {message && <Alert message={message} type="error" />}
      </Form>
    </div>
  )
}

export default Login

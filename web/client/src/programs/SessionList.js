import { useEffect, useState } from 'react'

import {
  Alert,
  Card,
  Form,
  Input,
  Layout,
  Modal,
  Radio,
  Space,
  Typography,
} from 'antd'
import AppHeader from 'components/AppHeader'
import AppFooter from 'components/AppFooter'
import { Link } from 'react-router-dom'
import sessionService from 'services/session.service'
import ErrorDisplay from 'components/ErrorDisplay'
import Loading from 'components/Loading'
import { PlusOutlined } from '@ant-design/icons'
import { useForm } from 'antd/lib/form/Form'

const { Content } = Layout
const { Title } = Typography

const programImageInfo = {
  jugan: { path: require('images/sun.png').default, description: '해' },
  bangmun: { path: require('images/door.png').default, description: '문' },
  ganho: { path: require('images/nurse.png').default, description: '간호사' },
  mokyok: { path: require('images/bath.png').default, description: '욕조' },
}

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
}

const ProgramLinks = ({ match }) => {
  const orgId = match.params.orgId

  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [modalVisible, setModalVisible] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [modalMessage, setModalMessage] = useState(null)

  const [form] = useForm()

  useEffect(() => {
    setError(null)
    setLoading(true)

    sessionService
      .getProgramSessionList(orgId)
      .then((res) => {
        setData(res.data)
        // console.log(res.data)
        setLoading(false)
      })
      .catch((error) => {
        setError(error)
        setLoading(false)
      })
  }, [orgId])

  /**
   * 폼 관련 메소드
   */
  const showModal = () => {
    setModalVisible(true)
  }

  const handleCancel = () => {
    form.resetFields()
    setModalVisible(false)
  }

  const onFinish = async (values) => {
    const { orgId, programId, sessionName } = values

    setModalMessage(null)
    setConfirmLoading(true)

    sessionService
      .addProgramSession(orgId, programId, sessionName)
      .then((res) => {
        setData([...data, res.data])
        setModalVisible(false)
        setConfirmLoading(false)
      })
      .catch((error) => {
        const resMessage =
          error.response?.data?.message || error.message || error.toString()
        setModalMessage(resMessage)
        setConfirmLoading(false)
      })
  }

  return (
    <Layout id="app-layout" style={{ minHeight: '100vh' }}>
      <Layout className="site-layout">
        <AppHeader showProfile={false} programSelectable={false} />
        <Content
          style={{
            display: 'grid',
            placeItems: 'center',
            gridTemplateRows: '100%',
          }}
        >
          {loading ? (
            <Loading />
          ) : error ? (
            <ErrorDisplay error={error} />
          ) : (
            <Space direction="vertical" align="center" size={[0, 50]}>
              <Title level={1}>
                {data.length === 0
                  ? '운영중인 프로그램이 없습니다. 새로 프로그램을 시작해 보세요!'
                  : '시작하실 프로그램을 선택해 주세요.'}
              </Title>
              <Space size={[20, 20]} wrap>
                {data.map((item) => (
                  <Link to={`${match.url}/${item.id}`} key={item.id}>
                    <Card
                      bordered={false}
                      hoverable={true}
                      style={{
                        textAlign: 'center',
                        width: '198px',
                        height: '250px',
                      }}
                    >
                      <img
                        src={programImageInfo[item.program.name].path}
                        alt={programImageInfo[item.program.name].description}
                        width="150"
                      />
                      <Title level={3}>
                        {item.name || item.program.description}
                      </Title>
                    </Card>
                  </Link>
                ))}
                <Card
                  bordered={false}
                  hoverable={true}
                  style={{
                    display: 'grid',
                    placeItems: 'center',
                    textAlign: 'center',
                    width: '198px',
                    height: '250px',
                  }}
                  onClick={showModal}
                >
                  <PlusOutlined
                    style={{
                      fontSize: '90px',
                    }}
                  />
                </Card>
                {/************************************************************/}
                {/******************** 모달 부분 *****************************/}
                {/************************************************************/}
                <Modal
                  title="프로그램 추가"
                  visible={modalVisible}
                  onOk={form.submit}
                  confirmLoading={confirmLoading}
                  onCancel={handleCancel}
                >
                  <Form
                    name="validate_other"
                    {...formItemLayout}
                    onFinish={onFinish}
                    initialValues={{
                      'input-number': 3,
                      'checkbox-group': ['A', 'B'],
                      rate: 3.5,
                    }}
                    form={form}
                  >
                    <Form.Item name="orgId" hidden={true} initialValue={orgId}>
                      <Input />
                    </Form.Item>

                    <Form.Item
                      name="programId"
                      label="프로그램 종류"
                      rules={[
                        { required: true, message: '프로그램을 선택하세요.' },
                        ({ setFieldsValue }) => ({
                          validator(_, value) {
                            setFieldsValue({
                              sessionName: value
                                ? ['주간', '방문', '간호', '목욕'][
                                    Number(value) - 1
                                  ] + '프로그램'
                                : '',
                            })
                            return Promise.resolve()
                          },
                        }),
                      ]}
                    >
                      <Radio.Group>
                        <Radio.Button value="1">주간</Radio.Button>
                        <Radio.Button value="2">방문</Radio.Button>
                        <Radio.Button value="3">간호</Radio.Button>
                        <Radio.Button value="4">목욕</Radio.Button>
                      </Radio.Group>
                    </Form.Item>

                    <Form.Item
                      name="sessionName"
                      label="프로그램 이름"
                      help="미 입력시, 기본 프로그램 이름을 따르게 됩니다."
                    >
                      <Input />
                    </Form.Item>

                    {modalMessage && (
                      <Alert message={modalMessage} type="error" />
                    )}
                  </Form>
                </Modal>
              </Space>
            </Space>
          )}
        </Content>
        <AppFooter />
      </Layout>
    </Layout>
  )
}

export default ProgramLinks

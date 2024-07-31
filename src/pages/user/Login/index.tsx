import Footer from '@/components/Footer';
import {login} from '@/services/ant-design-pro/api';
import {LockOutlined, UserOutlined,} from '@ant-design/icons';
import {LoginForm, ProFormCheckbox, ProFormText,} from '@ant-design/pro-components';
import {Alert, Divider, message, Space, Tabs} from 'antd';
import React, {useState} from 'react';
import {FormattedMessage, history, Link, SelectLang, useIntl, useModel} from 'umi';
import styles from './index.less';
import {BLOG_LINK, SYSTEM_LOGO} from "@/constants";

const LoginMessage: React.FC<{
  content: string;
}> = ({content}) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

const Login: React.FC = () => {
  const [userLoginState, setUserLoginState] = useState<API.LoginResult>({});
  const [type, setType] = useState<string>('account');
  const {initialState, setInitialState} = useModel('@@initialState');

  const intl = useIntl();

  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    if (userInfo) {
      await setInitialState((s) => ({
        ...s,
        currentUser: userInfo,
      }));
    }
  };

  const handleSubmit = async (values: API.LoginParams) => {
    try {
      // 登录
      const user = await login({...values, type});
      if (user) {
        const defaultLoginSuccessMessage = intl.formatMessage({
          id: 'pages.login.success',
          defaultMessage: '登录成功！',
        });
        message.success(defaultLoginSuccessMessage);
        await fetchUserInfo();
        /** 此方法会跳转到 redirect 参数所在的位置 */
        if (!history) return;
        const {query} = history.location;
        const {redirect} = query as { redirect: string };
        history.push(redirect || '/');
        return;
      }
      // console.log(user);
      // 如果失败去设置用户错误信息
      setUserLoginState(user);
    } catch (error) {
      const defaultLoginFailureMessage = intl.formatMessage({
        id: 'pages.login.failure',
        defaultMessage: '登录失败，请重试！',
      });
      message.error(defaultLoginFailureMessage);
    }
  };
  const {status, type: loginType} = userLoginState;

  return (
    <div className={styles.container}>
      <div className={styles.lang} data-lang>
        {SelectLang && <SelectLang/>}
      </div>
      <div className={styles.content}>
        <LoginForm
          logo={<img alt="logo" src={SYSTEM_LOGO}/>}
          title="LIHUIBEAR 知识星球"
          subTitle={
            <>
              <p><a href={BLOG_LINK} target="_blank" rel="noreferrer">开始探索的用户中心</a></p>

            </>
          } //新页面打开
          initialValues={{
            autoLogin: true,
          }}
          onFinish={async (values) => {
            await handleSubmit(values as API.LoginParams);
          }}
        >
          <Tabs activeKey={type} onChange={setType}>
            <Tabs.TabPane
              key="account"
              tab={'账号密码登录'}
            />
          </Tabs>

          {status === 'error' && loginType === 'account' && (
            <LoginMessage
              content={"错误的账号或密码"}
            />
          )}
          {type === 'account' && (
            <>
              <ProFormText
                name="userAccount"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined className={styles.prefixIcon}/>,
                }}
                placeholder="请输入账号"
                rules={[
                  {
                    required: true,
                    message: "账号是必填项",
                  },
                ]}
              />
              <ProFormText.Password
                name="userPassword"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined className={styles.prefixIcon}/>,
                }}
                placeholder="请输入密码"
                rules={[
                  {
                    required: true,
                    message: "密码是必填项",
                  },
                  {
                    min: 8,
                    type: 'string',
                    message: "密码长度不能小于8位",
                  },

                ]}
              />
            </>
          )}
          <div
            style={{
              marginBottom: 24,
            }}
          >
            <Space split={<Divider type="vertical"/>} size={"middle"}>
              <ProFormCheckbox noStyle name="autoLogin">
                <FormattedMessage id="pages.login.rememberMe" defaultMessage="自动登录"/>
              </ProFormCheckbox>
              {/*<Divider type={"vertical"}/>*/}
              <Link to="/user/register">新用户注册</Link>
              {/*<Divider type={"vertical"}/>*/}
              <a
                style={{
                  float: 'right',
                }}
                href={"https://blog.lihuibear.cn"}
              >忘记密码
              </a>
            </Space>

          </div>
        </LoginForm>
      </div>
      <Footer/>
    </div>
  );
};

export default Login;

import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-components';
import { useIntl } from 'umi';

const Footer: React.FC = () => {
  const intl = useIntl();
  const defaultMessage = intl.formatMessage({
    id: 'app.copyright.produced',
    defaultMessage: 'lihuibear出品',
  });

  const currentYear = new Date().getFullYear();

  return (
    <DefaultFooter
      copyright={`${currentYear} ${defaultMessage}`}
      links={[
        {
          key: 'Ant Design Pro',
          title: '知识博客',
          href: 'https://blog.lihuibear.cn',
          blankTarget: true,
        },
        {
          key: 'Ant Design',
          title: '知识笔记',
          href: 'https://lihuibear.cn',
          blankTarget: true,
        },
        {
          key: 'github',
          title: <><GithubOutlined />lihuibear Github</>,
          href: 'https://github.com/lihuibear4',
          blankTarget: true,
        },
      ]}
    />
  );
};

export default Footer;

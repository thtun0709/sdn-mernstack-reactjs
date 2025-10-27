import React from "react";
import { Form, Input, Button, message } from "antd";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthProvider";
import { App } from 'antd';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirect = new URLSearchParams(location.search).get("redirect") || "/";
  const { message } = App.useApp();

  const onFinish = async (values) => {
    try {
      await login(values);
      message.success("Đăng nhập thành công!");
      navigate(redirect);
    } catch (err) {
      console.error('Login error:', err);
      message.error(err.response?.data?.message || "Email hoặc mật khẩu không đúng!");
    }
  };

  return (
    <div className="auth-wrapper">
      <style>{`
        .auth-wrapper {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          background: radial-gradient(circle at 20% 20%, #1a0000 0%, #000 100%);
          color: #f1f1f1;
          text-align: center;
          padding: 20px;
        }

        .auth-wrapper h1 {
          color: #fff;
          text-transform: uppercase;
          font-weight: 700;
          font-size: 36px;
          letter-spacing: 2px;
          margin-bottom: 20px;
          border-bottom: 2px solid #c41e3a;
          display: inline-block;
          padding-bottom: 5px;
        }

        .auth-wrapper form {
          width: 100%;
          max-width: 450px;
          margin-top: 30px;
        }

        /* ✅ Fix nền input luôn đen mờ kể cả khi focus/đã nhập */
        .auth-wrapper .ant-input,
        .auth-wrapper .ant-input-affix-wrapper {
          background-color: rgba(0, 0, 0, 0.4) !important;
          color: #fff !important;
          border: none !important;
          border-bottom: 1px solid #444 !important;
          border-radius: 0 !important;
          box-shadow: none !important;
          padding: 10px 10px !important;
          transition: border-color 0.3s ease;
        }

        /* Khi hover hoặc focus — vẫn giữ nền đen mờ, chỉ đổi màu viền */
        .auth-wrapper .ant-input-affix-wrapper:hover,
        .auth-wrapper .ant-input-affix-wrapper-focused,
        .auth-wrapper .ant-input:focus {
          background-color: rgba(0, 0, 0, 0.4) !important;
          border-color: #c41e3a !important;
          box-shadow: none !important;
        }

        /* Fix AntD tự thêm màu trắng khi có value */
        .auth-wrapper .ant-input-affix-wrapper > input.ant-input {
          background-color: transparent !important;
          color: #fff !important;
        }

        .auth-wrapper input::placeholder {
          color: rgba(255, 255, 255, 0.6) !important;
        }

        /* Nút đăng nhập */
        .auth-wrapper button {
          width: 100%;
          background-color: #c41e3a;
          color: #fff;
          border: none;
          padding: 12px;
          text-transform: uppercase;
          font-weight: 600;
          border-radius: 2px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .auth-wrapper button:hover {
          background-color: #a91630;
          transform: scale(1.03);
        }

        .auth-wrapper p {
          margin-top: 15px;
          color: #ccc;
        }

        .auth-wrapper a {
          color: #c41e3a;
          text-decoration: none;
          font-weight: 600;
        }

        .auth-wrapper a:hover {
          text-decoration: underline;
        }
      `}</style>

      <h1>Login</h1>

      <Form
        onFinish={onFinish}
        layout="vertical"
        style={{ width: "100%", maxWidth: 450, marginTop: 30 }}
      >
        <Form.Item
          name="email"
          rules={[{ required: true, message: "Vui lòng nhập email!" }]}
        >
          <Input placeholder="Email" />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
        >
          <Input.Password placeholder="Password" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Login
          </Button>
        </Form.Item>
      </Form>

      <p>
        Don’t have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}

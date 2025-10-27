import React from "react";
import { Form, Input, Button, Select, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

const { Option } = Select;

export default function Register() {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const payload = {
        ...values,
        gender: values.gender === "true" || values.gender === true,
      };
      const res = await api.post("/api/auth/register", payload);
      message.success(res.data?.message || "Đăng ký thành công!");
      navigate("/login");
    } catch (err) {
      message.error(err?.response?.data?.message || "Đăng ký thất bại!");
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

  /* Input và Select */
  .auth-wrapper .ant-input,
  .auth-wrapper .ant-select-selector {
    background-color: rgba(0, 0, 0, 0.3) !important;
    color: #fff !important;
    border: none !important;
    border-bottom: 1px solid #444 !important;
    border-radius: 0 !important;
    padding: 12px 10px !important;
    box-shadow: none !important;
    transition: border-color 0.3s ease;
  }

  /* Password wrapper */
  .auth-wrapper .ant-input-affix-wrapper {
    background-color: rgba(0, 0, 0, 0.3) !important;
    border: none !important;
    border-bottom: 1px solid #444 !important;
    border-radius: 0 !important;
    padding: 0 !important;
    box-shadow: none !important;
  }

  .auth-wrapper .ant-input-affix-wrapper:hover,
  .auth-wrapper .ant-input-affix-wrapper-focused {
    border-color: #c41e3a !important;
    background-color: rgba(0, 0, 0, 0.3) !important;
    box-shadow: none !important;
  }

  .auth-wrapper .ant-input-affix-wrapper input {
    background-color: transparent !important;
    color: #fff !important;
  }

  /* Placeholder */
  .auth-wrapper input::placeholder,
  .auth-wrapper .ant-select-selection-placeholder {
    color: rgba(255, 255, 255, 0.6) !important;
  }

  /* Select dropdown */
  .ant-select-arrow, .ant-select-selection-item {
    color: #fff !important;
  }
  .ant-select-dropdown {
    background-color: #000 !important;
  }
  .ant-select-item {
    color: #fff !important;
  }
  .ant-select-item-option-active {
    background-color: #c41e3a !important;
  }

  /* Button */
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


      <h1>Register</h1>

      <Form
        onFinish={onFinish}
        layout="vertical"
        style={{ width: "100%", maxWidth: 450, marginTop: 30 }}
      >
        <Form.Item
          name="email"
          rules={[
            { required: true, message: "Vui lòng nhập email!" },
            { type: "email", message: "Email không hợp lệ!" },
          ]}
        >
          <Input placeholder="Email" />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
        >
          <Input.Password placeholder="Password" />
        </Form.Item>

        <Form.Item
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
        >
          <Input placeholder="Name" />
        </Form.Item>

        <Form.Item
          name="YOB"
          rules={[{ required: true, message: "Vui lòng nhập năm sinh!" }]}
        >
          <Input placeholder="Year of Birth" type="number" min="1900" max="2024" />
        </Form.Item>

        <Form.Item
          name="gender"
          rules={[{ required: true, message: "Vui lòng chọn giới tính!" }]}
        >
          <Select placeholder="Gender">
            <Option value="true">Male</Option>
            <Option value="false">Female</Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Register
          </Button>
        </Form.Item>
      </Form>

      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}

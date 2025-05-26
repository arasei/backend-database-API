'use client';

import React, { useState, ChangeEvent, FormEvent } from "react";
import classes from '@/app/contact/Contact.module.css';

// フォームデータの型
type FormData = {
  name: string;
  email: string;
  message: string;
};

// バリデーションエラーの型
type Errors = Partial<FormData>;

export default function Contact() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    message: "",
  });

  const [errors, setErrors] = useState<Errors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // 入力値の変更を処理
  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  // バリデーション
  const validate = (): boolean => {
    const errorMessages: Errors = {};

    if (!formData.name) {
      errorMessages.name = "お名前は入力必須です。";
    } else if (formData.name.length > 30) {
      errorMessages.name = "お名前は30文字以内で入力してください。";
    }

    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (!formData.email) {
      errorMessages.email = "メールアドレスは入力必須です。";
    } else if (!emailRegex.test(formData.email)) {
      errorMessages.email = "メールアドレスの形式が正しくありません。";
    }

    if (!formData.message) {
      errorMessages.message = "本文は入力必須です。";
    } else if (formData.message.length > 500) {
      errorMessages.message = "本文は500字以内で入力してください。";
    }

    setErrors(errorMessages);
    return Object.keys(errorMessages).length === 0;
  };

  // フォーム送信処理
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validate()) return;
    setIsSubmitting(true);

    try {
      const response = await fetch("https://1hmfpsvto6.execute-api.ap-northeast-1.amazonaws.com/dev/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Network response was not ok");

      alert("送信しました");
      handleClear();
      setErrors({});
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 入力値のクリア処理
  const handleClear = () => {
    setFormData({
      name: "",
      email: "",
      message: "",
    });
  };

  return (
    <div className={classes.contactForm}>
      <form onSubmit={handleSubmit}>
        <h2 className={classes.title}>問い合わせフォーム</h2>
        <div>

          <div className={classes.formColumn}>
            <label>
              お名前
            </label>
            <div className={classes.formFormat}>
              <input
                type="text"
                id="name"
                maxLength={30}
                value={formData.name}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              {errors.name && <p className={classes.formError}>{errors.name}</p>}
            </div>
          </div>
          

          <div className={classes.formColumn}>
            <label htmlFor="email">
              メールアドレス
            </label>
            <div className={classes.formFormat}>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              {errors.email && <p className={classes.formError}>{errors.email}</p>}
            </div>
          </div>

          <div className={classes.formColumn}>
            <label htmlFor={"message"}>
              本文
            </label>
            <div className={classes.formFormat}>
              <textarea
                id="message"
                maxLength={500}
                value={formData.message}
                onChange={handleChange}
                disabled={isSubmitting}
                rows={10}
              />
              {errors.message && <p className={classes.formError}>{errors.message}</p>}
            </div>
          </div>

          <div className={classes.formBtn}>
            <button
              type="submit"
              disabled={isSubmitting}
              className={classes.submitBtn}
            >
              送信
            </button>
            <button
              type="button"
              onClick={handleClear}
              disabled={isSubmitting}
              className={classes.clearBtn}
            >
              クリア
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
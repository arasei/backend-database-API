"use client";

import { useState } from "react";

type FormData = {
  name: string;
  email: string;
  message: string;
};

type Errors = {
  name?: string;
  email?: string;
  message?: string;
};

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const name = e.target.name;
    const value = e.target.value;
    setFormData({ ...formData, [name]: value });
  };

  const validate = (): Errors => {
    const newErrors: Errors = {};
    //名前：入力必須＆30文字以内
    if (!formData.name) {
      newErrors.name = "お名前は必須です。";
    } else if (formData.name.length > 30) {
      newErrors.name = "お名前は30文字以内で入力してください。";
    }
    //メールアドレス：入力必須＆メールアドレスの形式になっていること
    const emailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (!formData.email) {
      newErrors.email = "メールアドレスは必須です。";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "メールアドレスの形式が正しくありません。";
    }

    //本文：入力必須 & 500字以内
    if (!formData.message) {
      newErrors.message = "本文は必須です。";
    } else if (formData.message.length > 500) {
      newErrors.message = "本文は500文字以内で入力してください。";
    }
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);
    try {
      const response = await fetch(
        "https://1hmfpsvto6.execute-api.ap-northeast-1.amazonaws.com/dev/contacts",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      if (!response.ok) {
        throw new Error("送信に失敗しました");
      }

      alert("送信しました。");
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      if (error instanceof Error) alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setFormData({ name: "", email: "", message: "" });
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col  space-y-4 mx-auto w-[800px] max-w-[800px]"
    >
      <h1 className="text-lg font-bold mb-4 mt-6">問い合わせフォーム</h1>
      <div className="space-y-6">
        <div className="flex items-center space-x-4 ">
          <label htmlFor="name" className="  w-40 ">
            お名前
          </label>
          <input
            type="text"
            id="name"
            name="name"
            onChange={handleChange}
            value={formData.name}
            disabled={isLoading}
            className=" border border-stone-300 rounded-lg p-3 w-[600px] h-[60px]"
          />
        </div>
        {/* エラーメッセージ用コード */}
        {errors.name && (
          <p className="text-red-500 text-sm  ml-44 ">{errors.name}</p>
        )}
        <div className="flex items-center space-x-4">
          <label htmlFor="email" className="  w-40">
            メールアドレス
          </label>
          <input
            type="email"
            id="email"
            name="email"
            onChange={handleChange}
            value={formData.email}
            disabled={isLoading}
            className=" border rounded-lg p-3 border-stone-300 w-[600px] h-[60px]"
          />
        </div>
        {/* エラーメッセージ用コード */}
        {errors.email && (
          <p className="text-red-500 text-sm ml-44">{errors.email}</p>
        )}
        <div className="flex items-center space-x-4">
          <label htmlFor="message" className=" w-40">
            本文
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            disabled={isLoading}
            className=" border rounded-md p-3  border-stone-300 w-[600px] h-[250px]"
          ></textarea>
        </div>
        {/* エラーメッセージ用コード */}
        {errors.message && (
          <p className="text-red-500 text-sm ml-44">{errors.message}</p>
        )}

        <div className="flex space-x-4 justify-center font-bold">
          <button
            type="submit"
            disabled={isLoading}
            className="py-2 px-4 border block rounded-lg  text-white bg-gray-800"
          >
            送信
          </button>

          <button
            type="reset"
            onClick={handleClear}
            disabled={isLoading}
            className="py-2 px-4 border rounded-md bg-slate-200"
          >
            クリア
          </button>
        </div>
      </div>
    </form>
  );
};
export default ContactForm;
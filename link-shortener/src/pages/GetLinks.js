import React, { useState } from "react";
import { CopyIcon, LinkIcon } from "../vectors";
import { useFormik } from "formik";
import { shortenLink } from "../service/Link.service";
import ClipboardJS from "clipboard";

new ClipboardJS(".button");

const validate = (values) => {
  let errors = {};
  if (!values.url) {
    errors.url = "Required";
  } else if (
    !/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/.test(
      values.url
    )
  ) {
    errors.url = "Please provide a valid url";
  }
  return errors;
};

export const GetLinks = () => {
  const [newUrl, setNewUrl] = useState(null);
  const [isCopied, setIsCopied] = useState(false);

  const getShortenedLinks = async (values) => {
    if (!values) return;
    try {
      const {
        data: { result },
      } = await shortenLink(values);
      setNewUrl(result);
    } catch (error) {
      console.log("error", error);
    }
  };

  const formik = useFormik({
    initialValues: {
      url: "",
    },
    validate,
    onSubmit: getShortenedLinks,
  });

  return (
    <div className="h-screen justify-center items-center bg-indigo-900 flex flex-col">
      <div className="bg-white min-h-[180px] w-3/5 rounded-xl mx-auto px-8 py-10">
        <h1 className="text-start text-xl font-semibold mb-6">
          Link Shortener Application
        </h1>
        <form onSubmit={formik.handleSubmit}>
          <div className="relative mb-6 flex justify-between items-center">
            <div className="mr-5 relative flex-grow">
              <div className="flex absolute inset-y-0 left-2 top-3 z-10">
                <LinkIcon />
              </div>
              <input
                type="url"
                id="url"
                name="url"
                value={formik.values.url}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                placeholder="Enter a link here..."
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 h-12 block w-full pl-10"
              />
              {formik.touched.url && formik.errors.url ? (
                <div className="text-base text-red-500 absolute mb-2">
                  {formik.errors.url}
                </div>
              ) : null}
            </div>
            <button
              className="bg-orange-600 text-white rounded-lg px-4 py-2 font-medium h-12"
              disabled={!formik.isValid}
              type="submit"
              onClick={() => getShortenedLinks()}
            >
              Shorten Link
            </button>
          </div>
        </form>
        {newUrl && (
          <div className="flex items-center justify-between mt-6">
            <input
              value={newUrl.full_share_link}
              className="text-left bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 h-12 flex-grow mr-5"
              id="input"
            />
            {!isCopied ? (
                <button
                    data-clipboard-action="copy"
                    data-clipboard-target="#input"
                    onClick={() => {
                    setIsCopied(true);
                    setTimeout(() => {
                        setIsCopied(false);
                    }, 3000);
                    }}
                    className="bg-transparent border border-gray-300 text-gray-700 rounded-lg px-4 py-2 font-medium h-12 button"
                >
                    <CopyIcon />
                </button>
            ) : (
              <span>Copied!</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

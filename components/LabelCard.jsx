"use client";

import { useRef, useState } from "react";

export default function LabelCard({
  item,
  settings,
}) {

  const [image, setImage] =
    useState(null);

  const fileInputRef = useRef(null);

  const handleImage = (e) => {

    const file = e.target.files[0];

    if (file) {
      setImage(
        URL.createObjectURL(file)
      );
    }
  };

  return (

    <div
      className="label-card"
      style={{
        width: `${settings.width}mm`,
        height: `${settings.height}mm`,
      }}
    >

      {/* SOL */}
      <div className="label-left">

        {/* FOTO */}
        <div className="photo-area">

          {image ? (

            <img
              src={image}
              alt=""
              className="photo-img"
            />

          ) : (

            <span className="photo-placeholder">
              FOTO
            </span>

          )}

        </div>

        {/* FOTO BUTONU */}
        <button
          onClick={() =>
            fileInputRef.current.click()
          }
          className="photo-button"
        >
          FOTO
        </button>

        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          onChange={handleImage}
          className="hidden"
        />

      </div>

      {/* SAĞ */}
      <div className="label-right">

        <div>

          <div className="mini-brand">
            FISHER PRICE
          </div>

          <div className="product-title">
            {item.urun}
          </div>

          <div className="product-desc">
            ÜRÜN ÖZELLİĞİ
          </div>

        </div>

        {/* FİYAT */}
        <div className="price">
          €{item.fiyat} H.T
        </div>

        {/* ALT */}
        <div className="bottom-row">

          <div>
            Barkod: {item.barkod}
          </div>


        </div>

      </div>

    </div>
  );
}
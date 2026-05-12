"use client";

import { useRef, useState } from "react";
import Barcode from "react-barcode";

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

      {/* PROMO */}
      <div className="promo-badge">
        PROMO
      </div>

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
              PHOTO
            </span>

          )}

        </div>

        {/* FOTO BUTTON */}
        <button
          onClick={() =>
            fileInputRef.current.click()
          }
          className="photo-button"
        >
          PHOTO
        </button>

        {/* INPUT */}
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          onChange={handleImage}
          className="hidden"
        />

      </div>

      {/* SAG */}
      <div className="label-right">

        {/* UST */}
        <div>

          <div className="mini-brand">
            MARKET FRANCE
          </div>

          <div className="product-title">
            {item.urun}
          </div>

          <div className="product-desc">
            PRODUIT
          </div>

        </div>

        {/* FIYAT */}
        <div className="price">
          €{item.fiyat} HT
        </div>

        {/* BARKOD */}
        <div className="barcode-area">

          <Barcode
            value={String(item.barkod)}
            height={18}
            width={1}
            fontSize={8}
            displayValue={false}
          />

          <div className="barcode-text">
            {item.barkod}
          </div>

        </div>

      </div>

    </div>
  );
}
"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import Barcode from "react-barcode";

export default function LabelCard({
  item,
  settings,
}) {

  // FOTO KEY
  const storageKey =
    `photo-${item.urun}`;

  // FOTO
  const [image, setImage] =
    useState(null);

  // INPUT
  const fileInputRef = useRef(null);

  // FOTO LOAD
  useEffect(() => {

    const saved =
      localStorage.getItem(
        storageKey
      );

    if (saved) {

      setImage(saved);
    }

  }, [storageKey]);

  // FOTO EKLE
  const handleImage = (e) => {

    const file =
      e.target.files[0];

    if (!file) return;

    const reader =
      new FileReader();

    reader.onloadend = () => {

      const base64 =
        reader.result;

      setImage(base64);

      // SAVE
      localStorage.setItem(
        storageKey,
        base64
      );
    };

    reader.readAsDataURL(file);
  };

  return (

    <div
      className="label-card"
      style={{
        width:
          `${settings.width}mm`,
        height:
          `${settings.height}mm`,
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

      {/* SAĞ */}
      <div className="label-right">

        {/* ÜST */}
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

        {/* FİYAT */}
        <div className="price">
          €{item.fiyat} HT
        </div>

        {/* BARKOD */}
        <div className="barcode-area">

          <Barcode
            value={String(
              item.barkod
            )}
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
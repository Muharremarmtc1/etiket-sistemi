"use client";

import { useState } from "react";
import * as XLSX from "xlsx";
import LabelCard from "../components/LabelCard";

export default function Home() {

  // ÜRÜNLER
  const [items, setItems] =
    useState<any[]>([]);

  // SEÇİLENLER
  const [selected, setSelected] =
    useState<number[]>([]);

  // SEKME
  const [activeTab, setActiveTab] =
    useState("urunler");

  // ARAMA
  const [search, setSearch] =
    useState("");

  // ETİKET AYARI
  const [settings, setSettings] =
    useState({
      width: 90,
      height: 40,
    });

  // EXCEL YÜKLE
  const handleFile = (e: any) => {

    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = (evt: any) => {

      const data = evt.target.result;

      const workbook = XLSX.read(data, {
        type: "binary",
      });

      const sheetName =
        workbook.SheetNames[0];

      const sheet =
        workbook.Sheets[sheetName];

      const parsed: any =
        XLSX.utils.sheet_to_json(sheet);

      console.log(parsed);

      setItems(parsed);

      // seçimleri temizle
      setSelected([]);
    };

    reader.readAsBinaryString(file);
  };

  // ÜRÜN SEÇ
  const toggleSelect = (
    index: number
  ) => {

    setSelected((prev) => {

      // varsa kaldır
      if (prev.includes(index)) {

        return prev.filter(
          (i) => i !== index
        );
      }

      // yoksa ekle
      return [...prev, index];
    });
  };

  return (
    <main className="page-bg">

      {/* TOPBAR */}
      <div className="topbar">

        <h1 className="main-title">
          Système Étiquette
        </h1>

        {/* EXCEL */}
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFile}
        />

        {/* YAZDIR */}
        <button
          onClick={() => window.print()}
          className="print-btn"
        >
          Imprimer
        </button>

      </div>

      {/* ANA */}
      <div className="layout">

        {/* SOL PANEL */}
        <div className="sidebar">

          {/* SEKME */}
          <div className="tabs">

            <button
              className={
                activeTab === "urunler"
                  ? "tab-btn active-tab"
                  : "tab-btn"
              }
              onClick={() =>
                setActiveTab("urunler")
              }
            >
              Produits
            </button>

            <button
              className={
                activeTab === "ayarlar"
                  ? "tab-btn active-tab"
                  : "tab-btn"
              }
              onClick={() =>
                setActiveTab("ayarlar")
              }
            >
              Taille
            </button>

          </div>

          {/* ÜRÜNLER */}
          {activeTab === "urunler" && (

            <>

              {/* ARAMA */}
              <input
                type="text"
                placeholder="Rechercher..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                className="search-input"
              />

              {/* LİSTE */}
              <div className="product-list">

                {items
                  .filter((item: any) =>
                    item.urun
                      ?.toLowerCase()
                      .includes(
                        search.toLowerCase()
                      )
                  )
                  .map((item, index) => (

                    <label
                      key={index}
                      className="product-item"
                    >

                      <input
                        type="checkbox"
                        checked={selected.includes(index)}
                        onChange={() =>
                          toggleSelect(index)
                        }
                      />

                      <span>
                        {item.urun}
                      </span>

                    </label>

                  ))}

              </div>

            </>

          )}

          {/* AYARLAR */}
          {activeTab === "ayarlar" && (

            <div className="settings-box">

              {/* GENİŞLİK */}
              <label>
                Largeur (mm)
              </label>

              <input
                type="number"
                value={settings.width}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    width: Number(
                      e.target.value
                    ),
                  })
                }
              />

              {/* YÜKSEKLİK */}
              <label>
                Hauteur (mm)
              </label>

              <input
                type="number"
                value={settings.height}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    height: Number(
                      e.target.value
                    ),
                  })
                }
              />

            </div>

          )}

        </div>

        {/* SAĞ */}
        <div className="preview-area">

          <div className="a4-page">

            {selected.map((selectedIndex) => (

              <LabelCard
                key={selectedIndex}
                item={items[selectedIndex]}
                settings={settings}
              />

            ))}

          </div>

        </div>

      </div>

    </main>
  );
}
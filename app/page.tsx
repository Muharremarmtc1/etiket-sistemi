"use client";

import { useState } from "react";
import * as XLSX from "xlsx";
import LabelCard from "../components/LabelCard";

export default function Home() {

  const [items, setItems] =
    useState<any[]>([]);

  const [selected, setSelected] =
    useState<number[]>([]);

  const [activeTab, setActiveTab] =
    useState("urunler");

  const [search, setSearch] =
    useState("");

  const [settings, setSettings] =
    useState({
      width: 90,
      height: 40,
    });

  // EXCEL
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

      const parsed =
        XLSX.utils.sheet_to_json(sheet);

      setItems(parsed);
    };

    reader.readAsBinaryString(file);
  };

  // SEC
  const toggleSelect = (
    index: number
  ) => {

    setSelected((prev) => {

      if (prev.includes(index)) {

        return prev.filter(
          (i) => i !== index
        );
      }

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

        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFile}
        />

        <button
          onClick={() => window.print()}
          className="print-btn"
        >
          Imprimer
        </button>

      </div>

      {/* ANA */}
      <div className="layout">

        {/* SOL */}
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

          {/* URUNLER */}
          {activeTab === "urunler" && (

            <>

              <input
                type="text"
                placeholder="Rechercher..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                className="search-input"
              />

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

        {/* SAG */}
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
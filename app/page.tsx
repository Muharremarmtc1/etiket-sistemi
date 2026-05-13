"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import * as XLSX from "xlsx";

import jsPDF from "jspdf";

import html2canvas from "html2canvas";

import LabelCard from "../components/LabelCard";

export default function Home() {

  // ÜRÜNLER
  const [items, setItems] =
    useState<any[]>([]);

  // SEÇİLENLER
  const [selected, setSelected] =
    useState<number[]>([]);

  // DARK MODE
  const [darkMode, setDarkMode] =
    useState(false);

  // SEKME
  const [activeTab, setActiveTab] =
    useState("urunler");

  // SEARCH
  const [search, setSearch] =
    useState("");

  // ETİKET
  const [settings, setSettings] =
    useState({
      width: 90,
      height: 40,
    });

  // YENİ ÜRÜN
  const [newProduct, setNewProduct] =
    useState({
      urun: "",
      fiyat: "",
      barkod: "",
    });

  // PDF
  const printRef = useRef(null);

  // LOCAL STORAGE LOAD
  useEffect(() => {

    const savedItems =
      localStorage.getItem("items");

    const savedSelected =
      localStorage.getItem(
        "selected"
      );

    if (savedItems) {

      setItems(
        JSON.parse(savedItems)
      );
    }

    if (savedSelected) {

      setSelected(
        JSON.parse(savedSelected)
      );
    }

  }, []);

  // LOCAL STORAGE SAVE
  useEffect(() => {

    localStorage.setItem(
      "items",
      JSON.stringify(items)
    );

  }, [items]);

  useEffect(() => {

    localStorage.setItem(
      "selected",
      JSON.stringify(selected)
    );

  }, [selected]);

  // PDF
  const downloadPDF = async () => {

    const element: any =
      printRef.current;

    if (!element) return;

    const canvas =
      await html2canvas(element);

    const data =
      canvas.toDataURL("image/png");

    const pdf = new jsPDF(
      "p",
      "mm",
      "a4"
    );

    const width = 210;

    const height =
      (canvas.height * width) /
      canvas.width;

    pdf.addImage(
      data,
      "PNG",
      0,
      0,
      width,
      height
    );

    pdf.save("etiquettes.pdf");
  };

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

      const parsed: any =
        XLSX.utils.sheet_to_json(sheet);

      setItems(parsed);

      setSelected([]);
    };

    reader.readAsBinaryString(file);
  };

  // ÜRÜN EKLE
  const addProduct = () => {

    if (!newProduct.urun) return;

    const updated = [
      ...items,
      newProduct,
    ];

    setItems(updated);

    setNewProduct({
      urun: "",
      fiyat: "",
      barkod: "",
    });
  };

  // ÜRÜN SEÇ
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

    <main
      className={
        darkMode
          ? "page-bg dark"
          : "page-bg"
      }
    >

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

        {/* PRINT */}
        <button
          onClick={() => window.print()}
          className="print-btn"
        >
          Imprimer
        </button>

        {/* PDF */}
        <button
          onClick={downloadPDF}
          className="pdf-btn"
        >
          PDF
        </button>

        {/* DARK */}
        <button
          onClick={() =>
            setDarkMode(!darkMode)
          }
          className="dark-btn"
        >
          Dark
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

          {/* ÜRÜNLER */}
          {activeTab === "urunler" && (

            <>

              {/* SEARCH */}
              <input
                type="text"
                placeholder="Rechercher..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                className="search-input"
              />

              {/* EKLE */}
              <div className="add-product-box">

                <input
                  placeholder="Produit"
                  value={newProduct.urun}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      urun:
                        e.target.value,
                    })
                  }
                />

                <input
                  placeholder="Prix"
                  value={newProduct.fiyat}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      fiyat:
                        e.target.value,
                    })
                  }
                />

                <input
                  placeholder="Code-barres"
                  value={newProduct.barkod}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      barkod:
                        e.target.value,
                    })
                  }
                />

                <button
                  onClick={addProduct}
                  className="add-btn"
                >
                  Ajouter
                </button>

              </div>

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

        {/* SAĞ */}
        <div className="preview-area">

          <div
            className="a4-page"
            ref={printRef}
          >

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
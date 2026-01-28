import Swal from "sweetalert2";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { addDoc, deleteDoc, updateDoc, doc } from "firebase/firestore";
import { productsCollection, db } from "../lib/firebase";

// --- HELPER: Pilihan Kategori Lengkap ---
const getCategoryOptions = (selected: string = "") => {
  // Daftar kategori lengkap sesuai permintaan
  const categories = [
    { val: "streaming", label: "🎬 Streaming" },
    { val: "gaming", label: "🎮 Gaming" },
    { val: "code", label: "💻 Code" },
    { val: "automotive", label: "🚗 Automotive" },
    { val: "lifestyle", label: "👟 Lifestyle" },
    { val: "business", label: "💼 Business" },
    { val: "health", label: "🥗 Health" },
    { val: "it-software", label: "🖥️ IT & Software" },
    { val: "teaching", label: "📚 Teaching & Academy" },
    { val: "marketing", label: "📈 Marketing" },
    { val: "design", label: "🎨 Design" },
    { val: "finance", label: "💰 Finance" },
    { val: "photo-video", label: "📸 Photo & Video" },
    { val: "development", label: "⚙️ Development" },
    { val: "music", label: "🎵 Music" },
    { val: "other", label: "📦 Lainnya" },
  ];

  let options = `<option value="" disabled ${selected === "" ? "selected" : ""}>-- PILIH KATEGORI --</option>`;
  categories.forEach((cat) => {
    options += `<option value="${cat.val}" ${selected === cat.val ? "selected" : ""}>${cat.label}</option>`;
  });
  return options;
};

// --- CSS KHUSUS UNTUK MODAL ---
const swalStyles = `
  <style>
    .swal-row { display: flex; gap: 15px; margin-bottom: 15px; text-align: left; }
    .swal-col { flex: 1; display: flex; flex-direction: column; }
    .swal-label { font-size: 11px; color: #94a3b8; margin-bottom: 6px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
    .swal-input-custom { 
        background: #1e293b; border: 1px solid #334155; color: white; padding: 12px; border-radius: 8px; outline: none; font-size: 14px; transition: all 0.2s;
    }
    .swal-input-custom:focus { border-color: #06b6d4; box-shadow: 0 0 0 2px rgba(6,182,212,0.2); }
    .ql-toolbar { background: #f1f5f9; border-radius: 8px 8px 0 0; border-color: #cbd5e1; }
    .ql-container { background: white; color: #0f172a; border-radius: 0 0 8px 8px; border-color: #cbd5e1; min-height: 150px; font-size: 14px; }
    .checkbox-wrapper { display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 600; cursor: pointer; }
    .checkbox-wrapper input { width: 16px; height: 16px; cursor: pointer; accent-color: #06b6d4; }
  </style>
`;

// --- FUNGSI 1: TAMBAH PRODUK ---
export const handleAddProduct = async (t: any, onSuccess: () => void) => {
  const { value: formValues } = await Swal.fire({
    title: "Tambah Produk Baru",
    width: "800px",
    background: "#0f172a",
    color: "#fff",
    showCloseButton: true,
    html: `
            ${swalStyles}
            <div class="swal-row">
                <div class="swal-col">
                    <label class="swal-label">Nama Produk</label>
                    <input id="prod-name" class="swal-input-custom" placeholder="Contoh: Kitab Lengkap EV">
                </div>
                <div class="swal-col">
                    <label class="swal-label">URL Gambar</label>
                    <input id="prod-img" class="swal-input-custom" placeholder="https://...">
                </div>
            </div>
            <div class="swal-row">
                <div class="swal-col">
                    <label class="swal-label">Harga (Rp)</label>
                    <input id="prod-price" type="number" class="swal-input-custom" placeholder="150000">
                </div>
                <div class="swal-col">
                    <label class="swal-label">Kategori</label>
                    <select id="prod-cat" class="swal-input-custom">${getCategoryOptions(t)}</select>
                </div>
            </div>
            <div class="swal-row">
                <div class="swal-col">
                    <label class="swal-label">Subtitle / Slogan</label>
                    <input id="prod-subtitle" class="swal-input-custom" placeholder="Keterangan singkat produk...">
                </div>
            </div>
            <div class="swal-row">
                <div class="swal-col">
                    <label class="swal-label" style="color: #facc15;">🎥 Link Video YouTube (Baru)</label>
                    <input id="prod-video" class="swal-input-custom" placeholder="https://youtube.com/...">
                </div>
                <div class="swal-col">
                    <label class="swal-label" style="color: #06b6d4;">💰 Link Pembayaran</label>
                    <input id="prod-link" class="swal-input-custom" placeholder="Link Lynk.id / WA">
                </div>
            </div>
            <div class="swal-col" style="margin-bottom: 20px; text-align: left;">
                <label class="swal-label">Deskripsi Lengkap</label>
                <div id="editor-container"></div>
            </div>
        `,
    didOpen: () => {
      const container = document.getElementById("editor-container");
      if (container) {
        // @ts-ignore
        container._quill = new Quill(container, {
          theme: "snow",
          placeholder: "Tulis detail produk di sini...",
          modules: {
            toolbar: [
              ["bold", "italic", "underline"],
              [{ list: "ordered" }, { list: "bullet" }],
            ],
          },
        });
      }
    },
    preConfirm: () => {
      const container = document.getElementById("editor-container") as any;
      const description =
        container && container._quill ? container._quill.root.innerHTML : "";
      return {
        name: (document.getElementById("prod-name") as HTMLInputElement).value,
        price: Number(
          (document.getElementById("prod-price") as HTMLInputElement).value,
        ),
        category: (document.getElementById("prod-cat") as HTMLSelectElement)
          .value,
        image: (document.getElementById("prod-img") as HTMLInputElement).value,
        subtitle: (document.getElementById("prod-subtitle") as HTMLInputElement)
          .value,
        videoUrl: (document.getElementById("prod-video") as HTMLInputElement)
          .value,
        paymentLink: (document.getElementById("prod-link") as HTMLInputElement)
          .value,
        description: description,
        timestamp: Date.now(),
        isVisible: true,
        isBestSeller: false,
      };
    },
  });

  if (formValues) {
    try {
      await addDoc(productsCollection, formValues);
      onSuccess();
      Swal.fire("Sukses", "Produk berhasil ditambah", "success");
    } catch (e: any) {
      Swal.fire("Eror", e.message, "error");
    }
  }
};

// --- FUNGSI 2: EDIT PRODUK ---
export const handleEditProduct = async (
  product: any,
  onSuccess: () => void, 
) => {
  const { value: formValues } = await Swal.fire({
    title: "Edit Produk",
    width: "800px",
    background: "#0f172a",
    color: "#fff",
    showCloseButton: true,
    html: `
            ${swalStyles}
            <div class="swal-row">
                <div class="swal-col">
                    <label class="swal-label">Nama Produk</label>
                    <input id="edit-name" class="swal-input-custom" value="${product.name}">
                </div>
                <div class="swal-col">
                    <label class="swal-label">URL Gambar</label>
                    <input id="edit-img" class="swal-input-custom" value="${product.image}">
                </div>
            </div>
            <div class="swal-row">
                <div class="swal-col">
                    <label class="swal-label">Harga (Rp)</label>
                    <input id="edit-price" type="number" class="swal-input-custom" value="${product.price}">
                </div>
                <div class="swal-col">
                    <label class="swal-label">Kategori</label>
                    <select id="edit-cat" class="swal-input-custom">${getCategoryOptions( product.category)}</select>
                </div>
            </div>
            <div class="swal-row">
                <div class="swal-col">
                    <label class="swal-label">Subtitle / Slogan</label>
                    <input id="edit-subtitle" class="swal-input-custom" value="${product.subtitle || ""}">
                </div>
            </div>
            <div class="swal-row">
                <div class="swal-col">
                    <label class="swal-label" style="color: #facc15;">🎥 Link Video YouTube</label>
                    <input id="edit-video" class="swal-input-custom" value="${product.videoUrl || ""}">
                </div>
                <div class="swal-col">
                    <label class="swal-label" style="color: #06b6d4;">💰 Link Pembayaran</label>
                    <input id="edit-link" class="swal-input-custom" value="${product.paymentLink || ""}">
                </div>
            </div>
            <div class="swal-col" style="margin-bottom: 20px; text-align: left;">
                <label class="swal-label">Deskripsi Lengkap</label>
                <div id="edit-editor"></div>
            </div>
            <div class="swal-row" style="margin-bottom: 0;">
                <label class="checkbox-wrapper" style="color: #06b6d4;">
                    <input type="checkbox" id="edit-visible" ${product.isVisible !== false ? "checked" : ""}> Tampilkan Produk
                </label>
                <label class="checkbox-wrapper" style="color: #facc15;">
                    <input type="checkbox" id="edit-best" ${product.isBestSeller ? "checked" : ""}> Produk Terlaris
                </label>
            </div>
        `,
    didOpen: () => {
      const container = document.getElementById("edit-editor");
      if (container) {
        // @ts-ignore
        const quill = new Quill(container, {
          theme: "snow",
          modules: {
            toolbar: [
              ["bold", "italic", "underline"],
              [{ list: "ordered" }, { list: "bullet" }],
            ],
          },
        });
        quill.root.innerHTML = product.description || "";
        // @ts-ignore
        container._quill = quill;
      }
    },
    preConfirm: () => {
      const container = document.getElementById("edit-editor") as any;
      const description =
        container && container._quill ? container._quill.root.innerHTML : "";
      return {
        name: (document.getElementById("edit-name") as HTMLInputElement).value,
        price: Number(
          (document.getElementById("edit-price") as HTMLInputElement).value,
        ),
        category: (document.getElementById("edit-cat") as HTMLSelectElement)
          .value,
        image: (document.getElementById("edit-img") as HTMLInputElement).value,
        subtitle: (document.getElementById("edit-subtitle") as HTMLInputElement)
          .value,
        videoUrl: (document.getElementById("edit-video") as HTMLInputElement)
          .value,
        paymentLink: (document.getElementById("edit-link") as HTMLInputElement)
          .value,
        description: description,
        isVisible: (document.getElementById("edit-visible") as HTMLInputElement)
          .checked,
        isBestSeller: (document.getElementById("edit-best") as HTMLInputElement)
          .checked,
      };
    },
  });

  if (formValues) {
    await updateDoc(doc(db, "products", product.id), formValues);
    onSuccess();
    Swal.fire("Update!", "Data berhasil diubah", "success");
  }
};

// --- FUNGSI 3: HAPUS PRODUK ---
export const handleDeleteProduct = async (id: string, onSuccess: () => void) => {
  const res = await Swal.fire({
    title: "Hapus?",
    text: "Yakin menghapus produk ini?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#ef4444",
    cancelButtonColor: "#64748b",
  });

  if (res.isConfirmed) {
    await deleteDoc(doc(db, "products", id));
    onSuccess();
    Swal.fire("Dihapus!", "", "success");
  }
};

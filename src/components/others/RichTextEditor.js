// components/RichTextEditor.js
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyle } from "@tiptap/extension-text-style";
import TextAlign from "@tiptap/extension-text-align";
import { useEffect } from "react";

// Extension pour la taille de police
const FontSize = TextStyle.extend({
  addAttributes() {
    return {
      fontSize: {
        default: null,
        parseHTML: (element) => element.style.fontSize,
        renderHTML: (attributes) => {
          if (!attributes.fontSize) {
            return {};
          }
          return { style: `font-size: ${attributes.fontSize}` };
        },
      },
    };
  },
});

export default function RichTextEditor({ value, onChange }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      FontSize,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "");
    }
  }, [value, editor]);

  const addLink = () => {
    const url = window.prompt("Entrez l'URL");
    if (url) {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url })
        .run();
    }
  };

  const clearFormatting = () => {
    editor.chain().focus().clearNodes().unsetAllMarks().run();
  };

  const setFontSize = (size) => {
    editor.chain().focus().setMark("textStyle", { fontSize: size }).run();
  };

  return (
    <div className="border rounded p-3">
      {/* Barre d'outils */}
      <div className="mb-3 d-flex flex-wrap gap-2 align-items-center justify-content-around">
        {/* Groupe texte */}
        <div className="btn-group btn-group-sm" role="group">
          <button
            type="button"
            className={`btn ${
              editor.isActive("bold") ? "btn-primary" : "btn-outline-primary"
            }`}
            onClick={() => editor.chain().focus().toggleBold().run()}
            title="Gras"
          >
            <i className="fa-solid fa-bold"></i>
          </button>

          <button
            type="button"
            className={`btn ${
              editor.isActive("italic") ? "btn-primary" : "btn-outline-primary"
            }`}
            onClick={() => editor.chain().focus().toggleItalic().run()}
            title="Italique"
          >
            <i className="fa-solid fa-italic"></i>
          </button>

          <button
            type="button"
            className={`btn ${
              editor.isActive("underline")
                ? "btn-primary"
                : "btn-outline-primary"
            }`}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            title="Souligné"
          >
            <i className="fa-solid fa-underline"></i>
          </button>
        </div>

        {/* Groupe alignement */}
        <div className="btn-group btn-group-sm" role="group">
          <button
            type="button"
            className={`btn ${
              editor.isActive({ textAlign: "left" }) ||
              (!editor.isActive({ textAlign: "center" }) &&
                !editor.isActive({ textAlign: "right" }) &&
                !editor.isActive({ textAlign: "justify" }))
                ? "btn-primary"
                : "btn-outline-primary"
            }`}
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            title="Aligner à gauche"
          >
            <i className="fa-solid fa-align-left"></i>
          </button>

          <button
            type="button"
            className={`btn ${
              editor.isActive({ textAlign: "center" })
                ? "btn-primary"
                : "btn-outline-primary"
            }`}
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            title="Centrer"
          >
            <i className="fa-solid fa-align-center"></i>
          </button>

          <button
            type="button"
            className={`btn ${
              editor.isActive({ textAlign: "right" })
                ? "btn-primary"
                : "btn-outline-primary"
            }`}
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            title="Aligner à droite"
          >
            <i className="fa-solid fa-align-right"></i>
          </button>

          <button
            type="button"
            className={`btn ${
              editor.isActive({ textAlign: "justify" })
                ? "btn-primary"
                : "btn-outline-primary"
            }`}
            onClick={() => editor.chain().focus().setTextAlign("justify").run()}
            title="Justifier"
          >
            <i className="fa-solid fa-align-justify"></i>
          </button>
        </div>

        {/* Groupe listes */}
        <div className="btn-group btn-group-sm" role="group">
          <button
            type="button"
            className={`btn ${
              editor.isActive("bulletList")
                ? "btn-primary"
                : "btn-outline-primary"
            }`}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            title="Liste à puces"
          >
            <i className="fa-solid fa-list-ul"></i>
          </button>

          <button
            type="button"
            className={`btn ${
              editor.isActive("orderedList")
                ? "btn-primary"
                : "btn-outline-primary"
            }`}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            title="Liste numérotée"
          >
            <i className="fa-solid fa-list-ol"></i>
          </button>
        </div>

        {/* Lien, taille, nettoyage */}
        <div className="d-flex align-items-center gap-2">
          <button
            type="button"
            onClick={addLink}
            className="btn btn-sm btn-outline-primary d-flex align-items-center"
            title="Insérer un lien"
          >
            <i className="fa-solid fa-link me-1"></i>
            <span className="d-none d-sm-inline">Lien</span>
          </button>

          <select
            className="form-select form-select-sm w-auto"
            onChange={(e) => setFontSize(e.target.value)}
            defaultValue=""
          >
            <option value="">Taille</option>
            <option value="12px">Petit</option>
            <option value="16px">Normal</option>
            <option value="20px">Grand</option>
            <option value="24px">Très grand</option>
          </select>

          <button
            type="button"
            onClick={clearFormatting}
            className="btn btn-sm btn-outline-danger d-flex align-items-center"
            title="Nettoyer le style"
          >
            <i className="fa-solid fa-eraser me-1"></i>
            <span className="d-none d-sm-inline">Nettoyer</span>
          </button>
        </div>
      </div>

      {/* Contenu de l'éditeur */}
      <div className="border rounded p-2 bg-body">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

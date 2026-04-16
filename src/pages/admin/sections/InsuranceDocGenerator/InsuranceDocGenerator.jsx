import React, { useState, useCallback } from "react";
import { pdf } from "@react-pdf/renderer";
import {
  Plus,
  Trash3,
  FileEarmarkPdf,
  ChevronDown,
  ChevronUp,
  X,
} from "react-bootstrap-icons";
import InsurancePdfDocument from "./InsurancePdfDocument";
import "./InsuranceDocGenerator.scss";

const newField = (label = "", value = "") => ({
  id: crypto.randomUUID(),
  label,
  value,
});

const DEFAULT_CLIENT_FIELDS = [
  newField("Nombre completo"),
  newField("DNI / CUIT"),
  newField("Dirección"),
  newField("Teléfono"),
  newField("Email"),
];

const DEFAULT_INSURANCE_FIELDS = [
  newField("Aseguradora"),
  newField("Número de póliza"),
  newField("Tipo de cobertura"),
  newField("Vigencia desde"),
  newField("Vigencia hasta"),
  newField("Prima mensual"),
];

const DEFAULT_WORKER_FIELDS = [
  newField("Nombre completo"),
  newField("DNI"),
  newField("Cargo / Rol"),
  newField("Matrícula / Habilitación"),
  newField("Teléfono"),
];

const newMaterial = () => ({
  id: crypto.randomUUID(),
  description: "",
  quantity: 1,
  unit: "unidad",
  unit_price: 0,
  subtotal: 0,
});

const newLabor = () => ({
  id: crypto.randomUUID(),
  description: "",
  hours: 1,
  hourly_rate: 0,
  subtotal: 0,
});

const calcMaterial = (item) => ({
  ...item,
  subtotal: Number(item.quantity) * Number(item.unit_price),
});

const calcLabor = (item) => ({
  ...item,
  subtotal: Number(item.hours) * Number(item.hourly_rate),
});

const FieldGroup = ({ title, fields, onChange, onAdd, onRemove }) => {
  const [open, setOpen] = useState(true);

  return (
    <div className="idg-field-group">
      <div
        className="idg-field-group-header"
        onClick={() => setOpen((p) => !p)}
      >
        <span className="idg-field-group-title">{title}</span>
        <div className="idg-field-group-actions">
          <button
            type="button"
            className="idg-add-btn"
            onClick={(e) => {
              e.stopPropagation();
              onAdd();
            }}
          >
            <Plus size={14} /> Agregar
          </button>
          <button type="button" className="idg-collapse-btn">
            {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="idg-fields-list">
          {fields.map((f, i) => (
            <div key={f.id} className="idg-field-row">
              <input
                className="idg-input"
                value={f.label}
                onChange={(e) => onChange(i, "label", e.target.value)}
              />
              <input
                className="idg-input"
                value={f.value}
                onChange={(e) => onChange(i, "value", e.target.value)}
              />
              <button className="idg-remove-btn" onClick={() => onRemove(i)}>
                <Trash3 size={12} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const InsuranceDocGenerator = () => {
  const [docTitle, setDocTitle] = useState("Documento de Seguro");
  const [docId, setDocId] = useState(
    `P-${Math.floor(1000 + Math.random() * 9000)}`,
  );

  const [clientFields, setClientFields] = useState(DEFAULT_CLIENT_FIELDS);
  const [insuranceFields, setInsuranceFields] = useState(
    DEFAULT_INSURANCE_FIELDS,
  );
  const [workerFields, setWorkerFields] = useState(DEFAULT_WORKER_FIELDS);

  const [materials, setMaterials] = useState([newMaterial()]);
  const [laborItems, setLaborItems] = useState([newLabor()]);
  const [taxPct, setTaxPct] = useState(0);
  const [generating, setGenerating] = useState(false);

  const materialsTotal = materials.reduce((s, i) => s + i.subtotal, 0);
  const laborTotal = laborItems.reduce((s, i) => s + i.subtotal, 0);
  const subtotal = materialsTotal + laborTotal;
  const taxAmt = subtotal * (taxPct / 100);
  const total = subtotal + taxAmt;

  const updateMaterial = (i, key, val) =>
    setMaterials((p) => {
      const next = [...p];
      next[i] = calcMaterial({ ...next[i], [key]: val });
      return next;
    });

  const updateLabor = (i, key, val) =>
    setLaborItems((p) => {
      const next = [...p];
      next[i] = calcLabor({ ...next[i], [key]: val });
      return next;
    });

  const makeHandlers = (setter) => ({
    onChange: (i, k, v) =>
      setter((p) => {
        const n = [...p];
        n[i] = { ...n[i], [k]: v };
        return n;
      }),
    onAdd: () => setter((p) => [...p, newField()]),
    onRemove: (i) => setter((p) => p.filter((_, idx) => idx !== i)),
  });

  const handleGenerate = useCallback(async () => {
    setGenerating(true);
    try {
      const blob = await pdf(
        <InsurancePdfDocument
          data={{
            docTitle,
            docId,
            clientFields,
            insuranceFields,
            workerFields,
            materials,
            laborItems,
            totals: {
              subtotal,
              taxAmt,
              total,
              taxPct,
              materialsTotal,
              laborTotal,
            },
          }}
        />,
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "documento.pdf";
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setGenerating(false);
    }
  }, [
    clientFields,
    insuranceFields,
    workerFields,
    materials,
    laborItems,
    subtotal,
    taxAmt,
    total,
    taxPct,
    materialsTotal,
    laborTotal,
  ]);

  return (
    <div className="insurance-doc-generator">
      <div className="idg-section-wrapper idg-section-wrapper--meta">
        <div className="idg-section-inner-header">
          <span className="idg-section-label">Documento</span>
        </div>

        <div className="idg-meta-row">
          <div className="idg-meta-group">
            <label>Título del PDF</label>
            <input
              className="idg-config-input"
              value={docTitle}
              onChange={(e) => setDocTitle(e.target.value)}
            />
          </div>

          <div className="idg-meta-group">
            <label>Identificación</label>
            <input
              className="idg-config-input"
              value={docId}
              onChange={(e) => {
                const val = e.target.value;
                if (val.startsWith("P-")) setDocId(val);
              }}
            />
          </div>
        </div>
      </div>
      <FieldGroup
        title="Cliente"
        fields={clientFields}
        {...makeHandlers(setClientFields)}
      />
      <FieldGroup
        title="Seguro"
        fields={insuranceFields}
        {...makeHandlers(setInsuranceFields)}
      />
      <FieldGroup
        title="Trabajador"
        fields={workerFields}
        {...makeHandlers(setWorkerFields)}
      />

      <div className="idg-section-wrapper">
        <div className="idg-section-inner-header">
          <span className="idg-section-label">Materiales</span>
          <button
            className="idg-add-btn"
            onClick={() => setMaterials((p) => [...p, newMaterial()])}
          >
            <Plus size={14} /> Agregar
          </button>
        </div>

        <div className="idg-fields-list">
          {materials.map((m, i) => (
            <div key={m.id} className="idg-field-row idg-field-row--materials">
              <input
                className="idg-input"
                value={m.description}
                onChange={(e) =>
                  updateMaterial(i, "description", e.target.value)
                }
              />
              <input
                className="idg-input"
                type="number"
                value={m.quantity}
                onChange={(e) => updateMaterial(i, "quantity", e.target.value)}
              />
              <input
                className="idg-input"
                value={m.unit}
                onChange={(e) => updateMaterial(i, "unit", e.target.value)}
              />
              <input
                className="idg-input"
                type="number"
                value={m.unit_price}
                onChange={(e) =>
                  updateMaterial(i, "unit_price", e.target.value)
                }
              />
              <span>{m.subtotal}</span>
              <button
                className="idg-remove-btn"
                onClick={() =>
                  setMaterials((p) => p.filter((_, idx) => idx !== i))
                }
              >
                <Trash3 size={12} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="idg-section-wrapper">
        <div className="idg-section-inner-header">
          <span className="idg-section-label">Mano de obra</span>
          <button
            className="idg-add-btn"
            onClick={() => setLaborItems((p) => [...p, newLabor()])}
          >
            <Plus size={14} /> Agregar
          </button>
        </div>

        <div className="idg-fields-list">
          {laborItems.map((l, i) => (
            <div key={l.id} className="idg-field-row idg-field-row--labor">
              <input
                className="idg-input"
                value={l.description}
                onChange={(e) => updateLabor(i, "description", e.target.value)}
              />
              <input
                className="idg-input"
                type="number"
                value={l.hours}
                onChange={(e) => updateLabor(i, "hours", e.target.value)}
              />
              <input
                className="idg-input"
                type="number"
                value={l.hourly_rate}
                onChange={(e) => updateLabor(i, "hourly_rate", e.target.value)}
              />
              <span>{l.subtotal}</span>
              <button
                className="idg-remove-btn"
                onClick={() =>
                  setLaborItems((p) => p.filter((_, idx) => idx !== i))
                }
              >
                <Trash3 size={12} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="idg-section-wrapper">
        <div className="idg-config-block">
          <label>Impuesto (%)</label>
          <input
            className="idg-config-input"
            type="number"
            value={taxPct}
            onChange={(e) => setTaxPct(Number(e.target.value))}
          />
        </div>
      </div>

      <button
        className={`idg-btn-generate ${generating ? "idg-generating" : ""}`}
        onClick={handleGenerate}
      >
        <FileEarmarkPdf /> Generar PDF
      </button>
    </div>
  );
};

export default InsuranceDocGenerator;

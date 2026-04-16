import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from '@react-pdf/renderer';

const C = {
  accent: '#ffca2c',
  dark: '#0a0a0a',
  surface: '#151515',
  card: '#1a1a1a',
  text: '#ffffff',
  muted: '#9ca3af',
};

const fmt = (amount) =>
  new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(amount || 0);

const s = StyleSheet.create({
  page: {
    backgroundColor: C.dark,
    padding: 40,
    fontFamily: 'Helvetica',
    color: C.text,
    fontSize: 10,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 2,
    borderBottomColor: C.accent,
    paddingBottom: 12,
    marginBottom: 24,
  },

  title: {
    fontSize: 22,
    fontFamily: 'Helvetica-Bold',
    color: C.accent,
  },

  docId: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: C.accent,
    backgroundColor: 'rgba(255,202,44,0.12)',
    padding: '4 10',
    borderRadius: 4,
  },

  sectionTitle: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: C.accent,
    marginBottom: 8,
    marginTop: 12,
    paddingLeft: 6,
    borderLeftWidth: 3,
    borderLeftColor: C.accent,
  },

  fieldBlock: {
    backgroundColor: C.surface,
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: C.accent,
    marginBottom: 10,
  },

  fieldRow: {
    marginBottom: 4,
  },

  fieldLabel: {
    fontSize: 7,
    color: C.accent,
    fontFamily: 'Helvetica-Bold',
  },

  fieldValue: {
    fontSize: 9,
    color: C.muted,
  },


  table: {
    borderWidth: 1,
    borderColor: C.accent,
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 8,
  },

  tableHeader: {
    flexDirection: 'row',
    backgroundColor: C.card,
    borderBottomWidth: 1,
    borderColor: C.accent,
  },

  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: C.accent,
  },

  tableAlt: {
    backgroundColor: 'rgba(255,255,255,0.02)',
  },

  th: {
    padding: '6 8',
    fontSize: 7,
    color: C.accent,
    fontFamily: 'Helvetica-Bold',
  },

  td: {
    padding: '6 8',
    fontSize: 9,
    color: C.muted,
  },

  tdBold: {
    color: C.text,
    fontFamily: 'Helvetica-Bold',
  },

  tdAccent: {
    color: C.accent,
    fontFamily: 'Helvetica-Bold',
  },

  colDesc: { flex: 3 },
  colSmall: { width: 60, textAlign: 'right' },
  colPrice: { width: 80, textAlign: 'right' },

  subtotalRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 14,
  },

  subtotalText: {
    fontSize: 9,
    color: C.muted,
  },

  subtotalValue: {
    fontSize: 10,
    color: C.accent,
    fontFamily: 'Helvetica-Bold',
    marginLeft: 6,
  },

  totalsBox: {
    width: 260,
    alignSelf: 'flex-end',
    borderWidth: 1,
    borderColor: C.accent,
    borderRadius: 6,
    overflow: 'hidden',
    marginTop: 10,
  },

  totalsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: '6 10',
    borderBottomWidth: 1,
    borderBottomColor: C.accent,
  },

  totalsFinal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: '8 10',
    backgroundColor: 'rgba(255,202,44,0.08)',
  },
});

const Block = ({ title, fields }) => {
  if (!fields?.length) return null;

  return (
    <>
      <Text style={s.sectionTitle}>{title}</Text>
      <View style={s.fieldBlock}>
        {fields.map((f) => (
          <View key={f.id} style={s.fieldRow}>
            <Text style={s.fieldLabel}>{f.label}</Text>
            <Text style={s.fieldValue}>{f.value || '—'}</Text>
          </View>
        ))}
      </View>
    </>
  );
};

const InsurancePdfDocument = ({ data }) => {
  const {
    docTitle,
    docId,
    clientFields,
    insuranceFields,
    workerFields,
    materials,
    laborItems,
    totals,
  } = data;

  return (
    <Document>
      <Page size="A4" style={s.page}>

        <View style={s.header}>
          <Text style={s.title}>{docTitle || 'Documento'}</Text>
          <Text style={s.docId}>{docId || 'P-000000'}</Text>
        </View>

        <Block title="Cliente" fields={clientFields} />
        <Block title="Seguro" fields={insuranceFields} />
        <Block title="Trabajador" fields={workerFields} />

        {materials?.length > 0 && (
          <>
            <Text style={s.sectionTitle}>Materiales</Text>

            <View style={s.table}>
              <View style={s.tableHeader}>
                <Text style={[s.th, s.colDesc]}>Descripción</Text>
                <Text style={[s.th, s.colSmall]}>Cant</Text>
                <Text style={[s.th, s.colPrice]}>Precio</Text>
                <Text style={[s.th, s.colPrice]}>Subtotal</Text>
              </View>

              {materials.map((m, i) => (
                <View key={m.id} style={[s.tableRow, i % 2 && s.tableAlt]}>
                  <Text style={[s.td, s.tdBold, s.colDesc]}>{m.description}</Text>
                  <Text style={[s.td, s.colSmall]}>{m.quantity}</Text>
                  <Text style={[s.td, s.colPrice]}>{fmt(m.unit_price)}</Text>
                  <Text style={[s.td, s.tdAccent, s.colPrice]}>{fmt(m.subtotal)}</Text>
                </View>
              ))}
            </View>

            <View style={s.subtotalRow}>
              <Text style={s.subtotalText}>Subtotal materiales:</Text>
              <Text style={s.subtotalValue}>{fmt(totals.materialsTotal)}</Text>
            </View>
          </>
        )}

        {laborItems?.length > 0 && (
          <>
            <Text style={s.sectionTitle}>Mano de obra</Text>

            <View style={s.table}>
              <View style={s.tableHeader}>
                <Text style={[s.th, s.colDesc]}>Descripción</Text>
                <Text style={[s.th, s.colSmall]}>Horas</Text>
                <Text style={[s.th, s.colPrice]}>$/hora</Text>
                <Text style={[s.th, s.colPrice]}>Subtotal</Text>
              </View>

              {laborItems.map((l, i) => (
                <View key={l.id} style={[s.tableRow, i % 2 && s.tableAlt]}>
                  <Text style={[s.td, s.tdBold, s.colDesc]}>{l.description}</Text>
                  <Text style={[s.td, s.colSmall]}>{l.hours}</Text>
                  <Text style={[s.td, s.colPrice]}>{fmt(l.hourly_rate)}</Text>
                  <Text style={[s.td, s.tdAccent, s.colPrice]}>{fmt(l.subtotal)}</Text>
                </View>
              ))}
            </View>

            <View style={s.subtotalRow}>
              <Text style={s.subtotalText}>Subtotal mano de obra:</Text>
              <Text style={s.subtotalValue}>{fmt(totals.laborTotal)}</Text>
            </View>
          </>
        )}

        <View style={s.totalsBox}>
          <View style={s.totalsRow}>
            <Text>Subtotal</Text>
            <Text>{fmt(totals.subtotal)}</Text>
          </View>

          {totals.taxPct > 0 && (
            <View style={s.totalsRow}>
              <Text>IVA ({totals.taxPct}%)</Text>
              <Text>{fmt(totals.taxAmt)}</Text>
            </View>
          )}

          <View style={s.totalsFinal}>
            <Text>TOTAL</Text>
            <Text>{fmt(totals.total)}</Text>
          </View>
        </View>

      </Page>
    </Document>
  );
};

export default InsurancePdfDocument;
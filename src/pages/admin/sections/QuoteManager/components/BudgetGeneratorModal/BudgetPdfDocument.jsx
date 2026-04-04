import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from '@react-pdf/renderer';

// ── Colors matching the app palette ──────────────────────────
const C = {
  accent:   '#ffca2c',
  dark:     '#0a0a0a',
  surface:  '#151515',
  card:     '#1a1a1a',
  text:     '#ffffff',
  muted:    '#9ca3af',
  border:   'rgba(255,255,255,0.12)',
  success:  '#10b981',
  danger:   '#ef4444',
  white:    '#ffffff',
  black:    '#000000',
};

const fmt = (amount) =>
  new Intl.NumberFormat('es-AR', {
    style: 'currency', currency: 'ARS', maximumFractionDigits: 0,
  }).format(amount || 0);

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '—';

// ── Styles ────────────────────────────────────────────────────
const s = StyleSheet.create({
  page: {
    backgroundColor: C.dark,
    padding: 40,
    fontFamily: 'Helvetica',
    color: C.text,
    fontSize: 10,
  },

  // Header
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 28,
    paddingBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: C.accent,
  },
  companyName: {
    fontSize: 28,
    fontFamily: 'Helvetica-Bold',
    color: C.accent,
    letterSpacing: 3,
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  quoteNumber: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: C.accent,
    backgroundColor: 'rgba(255,202,44,0.15)',
    padding: '4 10',
    borderRadius: 4,
    marginBottom: 4,
  },
  quoteDate: {
    fontSize: 9,
    color: C.muted,
  },

  // Info grid
  infoGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  infoCard: {
    flex: 1,
    backgroundColor: C.surface,
    borderRadius: 6,
    padding: '10 12',
    borderWidth: 1,
    borderColor: C.accent,
  },
  infoCardLabel: {
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    color: C.accent,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 5,
  },
  infoCardPrimary: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: C.text,
    marginBottom: 2,
  },
  infoCardSecondary: {
    fontSize: 9,
    color: C.muted,
  },

  // Section
  sectionTitle: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: C.accent,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
    paddingLeft: 8,
    borderLeftWidth: 3,
    borderLeftColor: C.accent,
  },

  // Table
  table: {
    marginBottom: 6,
    borderRadius: 6,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: C.accent,
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
  tableRowAlt: {
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  th: {
    padding: '6 8',
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    color: C.accent,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  td: {
    padding: '6 8',
    fontSize: 9,
    color: C.muted,
  },
  tdBold: {
    fontFamily: 'Helvetica-Bold',
    color: C.text,
  },
  tdAccent: {
    color: C.accent,
    fontFamily: 'Helvetica-Bold',
  },

  // Column widths — materials
  colDesc:    { flex: 3 },
  colQty:     { width: 45, textAlign: 'right' },
  colUnit:    { width: 55 },
  colPrice:   { width: 75, textAlign: 'right' },
  colSub:     { width: 80, textAlign: 'right' },
  colNotes:   { flex: 2 },

  // Column widths — labor
  colHours:   { width: 45, textAlign: 'right' },
  colRate:    { width: 75, textAlign: 'right' },
  colTech:    { flex: 1.5 },

  sectionSubtotal: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 18,
  },
  sectionSubtotalText: {
    fontSize: 9,
    color: C.muted,
  },
  sectionSubtotalAmount: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: C.accent,
    marginLeft: 6,
  },

  // Totals
  totalsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
    marginBottom: 24,
  },
  totalsBox: {
    width: 260,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: C.accent,
  },
  totalsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: '6 12',
    borderBottomWidth: 1,
    borderBottomColor: C.accent,
  },
  totalsLabel: { fontSize: 9, color: C.muted },
  totalsValue: { fontSize: 9, color: C.muted, fontFamily: 'Helvetica-Bold' },
  totalsFinalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: '9 12',
    backgroundColor: 'rgba(255,202,44,0.08)',
  },
  totalsFinalLabel: { fontSize: 11, fontFamily: 'Helvetica-Bold', color: C.text },
  totalsFinalValue: { fontSize: 11, fontFamily: 'Helvetica-Bold', color: C.accent },
  totalsDepositRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: '6 12',
    backgroundColor: 'rgba(16,185,129,0.08)',
  },
  totalsDepositLabel: { fontSize: 9, color: C.success, fontFamily: 'Helvetica-Bold' },
  totalsDepositValue: { fontSize: 9, color: C.success, fontFamily: 'Helvetica-Bold' },

  // Footer
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    borderTopWidth: 1,
    borderTopColor: C.accent,
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerText: {
    fontSize: 8,
    color: 'rgba(255,255,255,0.3)',
  },
  footerAccent: {
    fontSize: 8,
    color: C.accent,
    opacity: 0.6,
  },

  // Notes
  notesBox: {
    backgroundColor: C.surface,
    borderRadius: 6,
    padding: '10 12',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: C.accent,
    borderLeftWidth: 3,
    borderLeftColor: C.accent,
  },
  notesText: {
    fontSize: 9,
    color: C.muted,
    lineHeight: 1.5,
  },

  // Validity
  validityRow: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 24,
  },
  validityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  validityLabel: { fontSize: 8, color: C.muted },
  validityValue: { fontSize: 9, fontFamily: 'Helvetica-Bold', color: C.text },
});

// ── Component ─────────────────────────────────────────────────

const BudgetPdfDocument = ({ data }) => {
  const { quote, totals, discountPct, taxPct } = data;
  const {
    materialsTotal, laborTotal, subtotal,
    discountAmt, taxAmt, total,
    depositPct, depositAmt, finalAmt,
  } = totals;

  const materials = quote.materials_budget?.items || [];
  const labor     = quote.labor_budget?.items     || [];
  const client    = quote.client;
  const address   = quote.address;

  return (
    <Document>
      <Page size="A4" style={s.page}>

        {/* ── Header ── */}
        <View style={s.headerBar}>
          <Text style={s.companyName}>RIFLI</Text>
          <View style={s.headerRight}>
            <Text style={s.quoteNumber}>{quote.quote_number}</Text>
            <Text style={s.quoteDate}>
              Emitido: {fmtDate(new Date().toISOString())}
            </Text>
            {quote.valid_until && (
              <Text style={s.quoteDate}>Válido hasta: {fmtDate(quote.valid_until)}</Text>
            )}
          </View>
        </View>

        {/* ── Info cards ── */}
        <View style={s.infoGrid}>
          <View style={s.infoCard}>
            <Text style={s.infoCardLabel}>Cliente</Text>
            <Text style={s.infoCardPrimary}>
              {client?.first_name} {client?.last_name}
            </Text>
            <Text style={s.infoCardSecondary}>{client?.email}</Text>
          </View>

          <View style={s.infoCard}>
            <Text style={s.infoCardLabel}>Servicio</Text>
            <Text style={s.infoCardPrimary}>
              {quote.service?.type || quote.service_type}
            </Text>
            <Text style={s.infoCardSecondary}>{quote.quote_number}</Text>
          </View>

          <View style={s.infoCard}>
            <Text style={s.infoCardLabel}>Dirección</Text>
            <Text style={s.infoCardPrimary}>
              {address?.street} {address?.number}
              {address?.floor ? `, Piso ${address.floor}` : ''}
            </Text>
            <Text style={s.infoCardSecondary}>
              {address?.city}, {address?.province}
            </Text>
          </View>
        </View>

        {/* ── Validity ── */}
        {(quote.valid_until || quote.estimated_completion_days) && (
          <View style={s.validityRow}>
            {quote.valid_until && (
              <View style={s.validityItem}>
                <Text style={s.validityLabel}>Presupuesto válido hasta: </Text>
                <Text style={s.validityValue}>{fmtDate(quote.valid_until)}</Text>
              </View>
            )}
            {quote.estimated_completion_days && (
              <View style={s.validityItem}>
                <Text style={s.validityLabel}>Tiempo estimado: </Text>
                <Text style={s.validityValue}>{quote.estimated_completion_days} días hábiles</Text>
              </View>
            )}
          </View>
        )}

        {/* ── Materials table ── */}
        {materials.length > 0 && (
          <>
            <Text style={s.sectionTitle}>Materiales</Text>
            <View style={s.table}>
              <View style={s.tableHeader}>
                <Text style={[s.th, s.colDesc]}>Descripción</Text>
                <Text style={[s.th, s.colQty]}>Cant.</Text>
                <Text style={[s.th, s.colUnit]}>Unidad</Text>
                <Text style={[s.th, s.colPrice]}>P. Unitario</Text>
                <Text style={[s.th, s.colSub]}>Subtotal</Text>
              </View>
              {materials.map((item, idx) => (
                <View key={item.id} style={[s.tableRow, idx % 2 === 1 && s.tableRowAlt]}>
                  <Text style={[s.td, s.tdBold, s.colDesc]}>{item.description}</Text>
                  <Text style={[s.td, s.colQty]}>{item.quantity}</Text>
                  <Text style={[s.td, s.colUnit]}>{item.unit}</Text>
                  <Text style={[s.td, s.colPrice]}>{fmt(item.unit_price)}</Text>
                  <Text style={[s.td, s.tdAccent, s.colSub]}>{fmt(item.subtotal)}</Text>
                </View>
              ))}
            </View>
            <View style={s.sectionSubtotal}>
              <Text style={s.sectionSubtotalText}>Subtotal materiales:</Text>
              <Text style={s.sectionSubtotalAmount}>{fmt(materialsTotal)}</Text>
            </View>
          </>
        )}

        {/* ── Labor table ── */}
        {labor.length > 0 && (
          <>
            <Text style={s.sectionTitle}>Mano de obra</Text>
            <View style={s.table}>
              <View style={s.tableHeader}>
                <Text style={[s.th, s.colDesc]}>Descripción</Text>
                <Text style={[s.th, s.colHours]}>Horas</Text>
                <Text style={[s.th, s.colRate]}>$/hora</Text>
                <Text style={[s.th, s.colSub]}>Subtotal</Text>
                <Text style={[s.th, s.colTech]}>Técnico</Text>
              </View>
              {labor.map((item, idx) => (
                <View key={item.id} style={[s.tableRow, idx % 2 === 1 && s.tableRowAlt]}>
                  <Text style={[s.td, s.tdBold, s.colDesc]}>{item.description}</Text>
                  <Text style={[s.td, s.colHours]}>{item.hours}</Text>
                  <Text style={[s.td, s.colRate]}>{fmt(item.hourly_rate)}</Text>
                  <Text style={[s.td, s.tdAccent, s.colSub]}>{fmt(item.subtotal)}</Text>
                  <Text style={[s.td, s.colTech]}>{item.technician || '—'}</Text>
                </View>
              ))}
            </View>
            <View style={s.sectionSubtotal}>
              <Text style={s.sectionSubtotalText}>Subtotal mano de obra:</Text>
              <Text style={s.sectionSubtotalAmount}>{fmt(laborTotal)}</Text>
            </View>
          </>
        )}

        {/* ── Totals ── */}
        <View style={s.totalsContainer}>
          <View style={s.totalsBox}>
            <View style={s.totalsRow}>
              <Text style={s.totalsLabel}>Subtotal</Text>
              <Text style={s.totalsValue}>{fmt(subtotal)}</Text>
            </View>
            {discountPct > 0 && (
              <View style={s.totalsRow}>
                <Text style={[s.totalsLabel, { color: C.success }]}>Descuento ({discountPct}%)</Text>
                <Text style={[s.totalsValue, { color: C.success }]}>— {fmt(discountAmt)}</Text>
              </View>
            )}
            <View style={s.totalsRow}>
              <Text style={s.totalsLabel}>IVA ({taxPct}%)</Text>
              <Text style={s.totalsValue}>{fmt(taxAmt)}</Text>
            </View>
            <View style={s.totalsFinalRow}>
              <Text style={s.totalsFinalLabel}>TOTAL</Text>
              <Text style={s.totalsFinalValue}>{fmt(total)}</Text>
            </View>
            <View style={s.totalsDepositRow}>
              <Text style={s.totalsDepositLabel}>Seña ({depositPct}%)</Text>
              <Text style={s.totalsDepositValue}>{fmt(depositAmt)}</Text>
            </View>
            <View style={s.totalsRow}>
              <Text style={s.totalsLabel}>Pago final ({100 - depositPct}%)</Text>
              <Text style={s.totalsValue}>{fmt(finalAmt)}</Text>
            </View>
          </View>
        </View>

        {/* ── Notes ── */}
        {quote.client_notes && (
          <>
            <Text style={s.sectionTitle}>Notas del cliente</Text>
            <View style={s.notesBox}>
              <Text style={s.notesText}>{quote.client_notes}</Text>
            </View>
          </>
        )}

        {/* ── Footer ── */}
        <View style={s.footer} fixed>
          <Text style={s.footerText}>
            RIFLI — Soluciones Profesionales
          </Text>
          <Text style={s.footerAccent}>{quote.quote_number}</Text>
        </View>

      </Page>
    </Document>
  );
};

export default BudgetPdfDocument;
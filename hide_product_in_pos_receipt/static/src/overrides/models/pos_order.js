import { PosOrder } from "@point_of_sale/app/models/pos_order";
import { patch } from "@web/core/utils/patch";
import { _t } from "@web/core/l10n/translation";
import { formatDate, formatDateTime, serializeDateTime } from "@web/core/l10n/dates";
import { omit } from "@web/core/utils/objects";
import { parseUTCString, qrCodeSrc, random5Chars, uuidv4, gte, lt } from "@point_of_sale/utils";
import { floatIsZero, roundPrecision } from "@web/core/utils/numbers";

patch(PosOrder.prototype, {

    export_for_printing(baseUrl, headerData) {
        const paymentlines = this.payment_ids
            .filter((p) => !p.is_change)
            .map((p) => p.export_for_printing());

        const taxTotals = this.taxTotals;

        const order_rounding = taxTotals.order_rounding;
        const order_change = this.get_change();

        return {
            orderlines: this.getSortedOrderlines()
                .filter((l) => !l.product_id?.hide_in_pos_receipt)
                .map((l) => omit(l.getDisplayData(), "internalNote")),
            taxTotals: taxTotals,
            label_total: _t("TOTAL"),
            label_rounding: _t("Rounding"),
            label_change: _t("CHANGE"),
            label_discounts: _t("Discounts"),
            show_rounding: !floatIsZero(order_rounding, this.currency.decimal_places),
            order_rounding: order_rounding,
            show_change: !floatIsZero(order_change, this.currency.decimal_places),
            order_change: order_change,
            paymentlines,
            amount_total: this.get_total_with_tax(),
            total_without_tax: this.get_total_without_tax(),
            amount_tax: this.get_total_tax(),
            total_paid: this.get_total_paid(),
            total_discount: this.get_total_discount(),
            tax_details: this.get_tax_details(),
            change: this.amount_return,
            name: this.pos_reference,
            generalNote: this.general_note || "",
            invoice_id: null, //TODO
            cashier: this.getCashierName(),
            date: formatDateTime(parseUTCString(this.date_order)),
            pos_qr_code:
                this.company.point_of_sale_use_ticket_qr_code &&
                this.finalized &&
                qrCodeSrc(`${baseUrl}/pos/ticket/`),
            ticket_code: this.ticket_code,
            base_url: baseUrl,
            footer: this.config.receipt_footer,
            // FIXME: isn't there a better way to handle this date?
            shippingDate: this.shipping_date && formatDate(DateTime.fromSQL(this.shipping_date)),
            headerData: {
                ...headerData,
                trackingNumber: this.tracking_number,
            },
            screenName: "ReceiptScreen",
        };
    }

});
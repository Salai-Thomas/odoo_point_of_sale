from odoo import models, fields,api

class ProductTemplateInherit(models.Model):
    _inherit = 'product.template'

    hide_in_pos_receipt = fields.Boolean(
        string="Hide in POS Receipt",
        help="If enabled, this product will not appear in POS receipt",
        store=True,
    )


class ProductProductInherit(models.Model):
    _inherit = "product.product"

    hide_in_pos_receipt = fields.Boolean(
        string="Hide in POS Receipt",
        help="If enabled, this product will not appear in POS receipt",
        related="product_tmpl_id.hide_in_pos_receipt",
        store=True,
        readonly=False,
    )

    @api.model
    def _load_pos_data_fields(self, config_id):
        fields = super()._load_pos_data_fields(config_id)
        fields.append('hide_in_pos_receipt')
        return fields

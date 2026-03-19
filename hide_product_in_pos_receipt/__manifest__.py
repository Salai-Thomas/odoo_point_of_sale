# -*- coding: utf-8 -*-
{
  "name": "Hide Product In Pos Receipt",
  "version": '18.0.1.0.0',
  "category": "Point Of Sale",
  'summary': 'Hide selected products from appearing on the POS receipt.',
  'description': '''
      Detailed description of the module
  ''',
  'author': 'Salai Thomas',
  "depends": ["point_of_sale"],
  "data": [
      'views/product_inherit_views.xml',
  ],

  "assets": {
      'point_of_sale._assets_pos': [
          'hide_product_pos_receipt/static/src/overrides/models/pos_order.js',
      ]
  },
    "images": [
        "static/description/banner.png",
    ],
  "license": "LGPL-3",
  "installable": True,
  "auto_install": False,
  "application": True
}
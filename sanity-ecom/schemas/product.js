export default {
    name: 'product',
    title: 'Product',
    type: 'document',
    fields: [
        {
            name: 'image',
            title: 'Image',
            type: 'array',
            of: [{type: 'image' }],
            options: {
                hotspot: true,
            }
        },
        {
            name: 'name',
            title: 'Name',
            type: 'string',
        },
        {
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: {
                source: 'name',
                maxLength: 90,
            }
        },
        {
            name: 'price',
            title: 'Price',
            type: 'number',
        },
        {
            name: 'itemNumber',
            title: 'Item Number',
            type: 'number',
            validation: Rule => Rule.required().min(1).integer()
        },
        {
            name: 'seller',
            title: 'Seller',
            type: 'string',
            validation: Rule => Rule.required(),
            options: {
                list: [
                    { title: 'DevB Games Inc.', value: 'DevB Games Inc.' },
                    { title: 'PaolaPixel Games Inc.', value: 'PaolaPixel Games Inc.' },
                    { title: 'Alibaba Games Inc.', value: 'Alibaba Games Inc.' },
                    { title: 'G Mania Games Inc.', value: 'G Mania Games Inc.' }
                ]
            }
        },
        {
            name: 'sellerAddress',
            title: 'Seller Address',
            type: 'string',
            validation: Rule => Rule.required(),
            options: {
                list: [
                    { title: 'DevB Games Inc.', value: '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4' },
                    { title: 'PaolaPixel Games Inc.', value: '0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2' },
                    { title: 'Alibaba Games Inc.', value: '0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db' },
                    { title: 'G Mania Games Inc.', value: '0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB' }
                ]
            }
        },
        {
            name: 'details',
            title: 'Details',
            type: 'string',
        }
    ]
}
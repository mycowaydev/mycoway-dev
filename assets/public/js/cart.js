testing = false;

if (!sessionStorage.cart && testing) {
    console.log('******* testing ******** add dummy item to session storage cart')
    var cart_list = [];
    var itemA = {
        product_id: '0001',
        product_name: 'water purifier A',
        desc: 'can filter water',
        quantity: 2,
        image: [
            'https://res.cloudinary.com/dp1opv9ke/image/upload/v1557500225/coway/order/1ip6WsESyXIMm6ZB-etw2alN.jpg',
            'url2'
        ],
        price: 114.50,
        payment: 120.00,
        payment_type: 'R',
        service: [
            {
                name: 'sst',
                value: 6,
                unit: '%',
                per_order_charge: false,
                remarks: 'this is services remarks'
            },{
                name: 'discount',
                value: 20,
                unit: 'RM',
                per_order_charge: false,
                remarks: 'this is services remarks'
            }
        ],
        remarks: 'this product remarks'
    };
    cart_list.push(itemA);

    var itemB = {
        product_id: '0002',
        product_name: 'water purifier B',
        desc: 'can filter water',
        quantity: 1,
        image: [
            'url1',
            'url2'
        ],
        payment: 135.00,
        payment_type: 'P',
        service: [
            {
                name: 'shipping',
                value: 100,
                unit: 'RM',
                per_order_charge: true,
                remarks: 'this is services remarks'
            }
        ],
        remarks: 'this product remarks'
    };
    cart_list.push(itemB);

    sessionStorage.cart = JSON.stringify(cart_list);
}

if (sessionStorage.cart) {
//    console.log('is empty ' + !Object.keys(sessionStorage.cart).length);
//    console.log('session.cart : ');
//    console.log(JSON.parse(sessionStorage.cart))
}

var emptyRowContent = "<tr><td colspan='7' class='string_no_product_selected'><td></tr>"

function getOrderCharges(name, value, unit) {
    return "<tr class='shipping_area'>" +
           "<td class='d-none d-md-block'></td>" +
           "<td></td>" +
           "<td></td>" +
           "<td>" +
               "<h5>" + name + "</h5>" +
           "</td>" +
           "<td colspan='2'>" +
               "<h7>" + unit + " " + value + "</h7>" +
           "</td>" +
       "</tr>"
}

function getDefaultRowContent() {
    return "<tr class='out_button_area'>" +
       "<td colspan='7'>" +
           "<div class='checkout_btn_inner d-flex align-items-center'>" +
               "<a class='gray_btn string_continue_shopping' href='/'></a>" +
               "<a class='primary-btn ml-2 string_proceed_order_detail' id='checkout' href='order-form'></a>" +
           "</div>" +
       "</td>" +
   "</tr>"
}

function addQuantity(elementIndex) {
	var result = document.getElementById('qty' + elementIndex);
	var qty = result.value;
	if( !isNaN( qty )){
	    result.value++;

        var cart_list = JSON.parse(sessionStorage.cart);
        cart_list[elementIndex].quantity = result.value;
        sessionStorage.cart = JSON.stringify(cart_list);

        $("#item-total"+elementIndex).html("RM " + (cart_list[elementIndex].price * cart_list[elementIndex].quantity))
	}
	refreshCartNumber();
}

function reduceQuantity(elementIndex) {
    var result = document.getElementById('qty' + elementIndex);
    var qty = result.value;
    if( !isNaN( qty ) && qty > 1 ){
        result.value--;

        var cart_list = JSON.parse(sessionStorage.cart);
        cart_list[elementIndex].quantity = result.value;
        sessionStorage.cart = JSON.stringify(cart_list);

        $("#item-total"+elementIndex).html("RM " + (cart_list[elementIndex].price * cart_list[elementIndex].quantity))
    }
    refreshCartNumber();
}

function deleteItem(elementIndex) {
    var cart_list = JSON.parse(sessionStorage.cart);
    cart_list.splice(elementIndex,1);
    sessionStorage.cart = JSON.stringify(cart_list);

    $('#cartItemRow' + elementIndex).remove();
    if (cart_list.length === 0){
        $("tbody").prepend(emptyRowContent);
        $('#checkout').click(function(e) {
            e.preventDefault();
        });
        $('#checkout').addClass('button-disable');
    }

    $("#pageloader").fadeIn();
    document.location.reload();
}

if (sessionStorage.cart) {
    var cart_list = JSON.parse(sessionStorage.cart);

    if (cart_list.length === 0) {
        $('tbody').append(emptyRowContent);
    } else {
        $.each( cart_list , function( index, obj ){
            $('tbody').append(
                "<tr id='cartItemRow" + index + "'>" +
                    "<td>" +
                        "<div class='media'>" +
                            "<div class='d-flex'>" +
                                "<img class='cart-product-img' alt='' src='" + obj.image[0] + "'>" +
                            "</div>" +
                            "<div class='media-body'>" +
                                "<p>" + obj.product_name + "</p>" +
                            "</div>" +
                        "</div>" +
                    "</td>" +
                    "<td>" +
                        "<h5>RM&nbsp;" + obj.price + "</h5>" +
                    "</td>" +
                    "<td>" +
                        "<h5>" + getStringById('string_payment_method')[obj.payment_type] + "</h5>" +
                    "</td>" +
                    "<td>" +
                        "<div class='product_count'>" +
                            "<input class='input-text qty' id='qty" + index + "' maxlength='12' name='qty' title='Quantity:' type='text' value='" + obj.quantity + "'>" +
                            "<button class='increase items-count' onclick=\"addQuantity(" + index + ", " + obj.price + ")\" type='button'>" +
                                "<i class='lnr lnr-chevron-up'></i>" +
                            "</button>" +
                            "<button class='reduced items-count' onclick=\"reduceQuantity(" + index + ", " + obj.price +")\" type='button'>" +
                                "<i class='lnr lnr-chevron-down'></i>" +
                            "</button>" +
                        "</div>" +
                    "</td>" +
                    "<td class='cart_nowrap'>" +
                        "<h5 id='item-total" + index + "'>RM " + (obj.price * obj.quantity) + "</h5>" +
                    "</td>" +
                    "<td><a onclick=\"deleteItem(" + index + ")\"><i class='far fa-trash-alt'></i></a></td>" +
                "</tr>"
            );
        });
    }

    $('tbody').append(getDefaultRowContent());

    if (cart_list.length === 0) {
        $('#checkout').click(function(e) {
            e.preventDefault();
        });
        $('#checkout').addClass('button-disable');
    }
} else {
    $('tbody').append(emptyRowContent);
    $('tbody').append(getDefaultRowContent());
    $('#checkout').click(function(e) {
        e.preventDefault();
    });
    $('#checkout').addClass('button-disable');
}




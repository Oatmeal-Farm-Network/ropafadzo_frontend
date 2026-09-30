
<%@LANGUAGE="VBScript"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
	"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">
<head>
</head>
<body>

<%
curl -s --insecure
-H "X-PAYPAL-SECURITY-USERID: api_username"
-H "X-PAYPAL-SECURITY-PASSWORD: api_password"
-H "X-PAYPAL-SECURITY-SIGNATURE: api_signature"
-H "X-PAYPAL-REQUEST-DATA-FORMAT: NV"
-H "X-PAYPAL-RESPONSE-DATA-FORMAT: NV"
-H "X-PAYPAL-APPLICATION-ID: app_id"
https://svcs.sandbox.paypal.com/AdaptivePayments/Pay -d
"requestEnvelope.errorLanguage=en_US
&actionType=PAY
&senderEmail=sender@domain
&receiverList.receiver(0).email=johna_1282413342_biz@webartists.bi
&receiverList.receiver(0).amount=100.00
&currencyCode=USD
&feesPayer=EACHRECEIVER
&memo=Simple payment example.
&cancelUrl=http://www.theandresengroup.com/ecommercetest2.asp
&returnUrl=http://www.theandresengroup.com/EventOrderCompletion.asp
&ipnNotificationUrl=http://www.theandresengroup.com/EventOrderCompletion.asp"

 %>

</body>
</HTML>
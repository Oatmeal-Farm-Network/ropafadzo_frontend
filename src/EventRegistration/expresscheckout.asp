<!-- #include file ="paypalfunctions.asp" -->
<%
' ==================================
' Payflow Express Checkout Module
' ==================================

On Error Resume Next

'------------------------------------
' The paymentAmount is the total value of 
' the shopping cart, that was set 
' earlier in a session variable 
' by the shopping cart page
'------------------------------------
paymentAmount = Session("Payment_Amount")

'------------------------------------
' The currencyCodeType and paymentType 
' are set to the selections made on the Integration Assistant 
'------------------------------------
currencyCodeType = "USD"
paymentType = ""

'------------------------------------
' The returnURL is the location where buyers return to when a
' payment has been succesfully authorized.
'
' This is set to the value entered on the Integration Assistant 
'------------------------------------
returnURL = ""

'------------------------------------
' The cancelURL is the location buyers are sent to when they click the
' return to XXXX site where XXX is the merhcant store name
' during payment review on PayPal
'
' This is set to the value entered on the Integration Assistant 
'------------------------------------
cancelURL = ""

'------------------------------------
' Calls SetExpressCheckout
'
' The CallShortcutExpressCheckout function is defined in the file PayPalFunctions.asp,
' it is included at the top of this file.
'-------------------------------------------------
Set resArray = CallShortcutExpressCheckout (paymentAmount, currencyCodeType, paymentType, returnURL, cancelURL)

ack = UCase(resArray("RESULT"))
If ack="0" Then
	' Redirect to paypal.com
	ReDirectURL( resArray("TOKEN") )
Else  
	'Display a user friendly Error on the page using any of the following error information returned by Payflow
	' See Table 4.2 and 4.3 in http://www.paypal.com/en_US/pdf/PayflowPro_Guide.pdf for a list of RESULT values (error codes)
	ErrorCode = ack
	ErrorMsg = resArray("RESPMSG")
End If
%>
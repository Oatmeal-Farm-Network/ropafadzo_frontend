<%@Language="VBSCRIPT"%>
<%
	' ===================================================
	' PayPal API Include file
	' 
	' Defines all the global variables and the wrapper functions 
	'-----------------------------------------------------------

	Dim gv_APIEndpoint
	Dim gv_APIUser
	Dim gv_APIPassword
	Dim gv_APIVendor
	Dim gv_APIPartner
	Dim gv_BNCode

	Dim gv_ProxyServer	
	Dim gv_ProxyServerPort 
	Dim gv_Proxy		
	
	'----------------------------------------------------------------------------------
	' Authentication Credentials for making the call to the server
	'----------------------------------------------------------------------------------
	Env = "pilot"
	
	'------------------------------------
	' PayPal API Credentials 
	'------------------------------------
	gv_APIUser	= ""
	' Fill in the gv_APIPassword variable yourself, the wizard will not do this automatically
	gv_APIPassword	= ""
	gv_APIVendor = ""
	gv_APIPartner = ""

	'-----------------------------------------------------
	' The BN Code only applicable for partners
	'----------------------------------------------------
	gv_BNCode = "PF-ECWizard"

	'----------------------------------------------------------------------
	' Define the PayPal URLs for Express Checkout 
	' 	This is the URL that the buyer is first sent to do authorize payment with their paypal account
	' 	change the URL depending if you are testing on the sandbox
	' 	or going to the live PayPal site
	'
	' For the sandbox, the URL is       https://www.sandbox.paypal.com/cgi-bin/webscr?cmd=_express-checkout&token=
	' For the live site, the URL is     https://www.paypal.com/cgi-bin/webscr?cmd=_express-checkout&token=
	'------------------------------------------------------------------------
	if Env = "pilot" Then
		gv_APIEndpoint = "https://pilot-payflowpro.paypal.com"
		PAYPAL_URL = "https://www.sandbox.paypal.com/cgi-bin/webscr?cmd=_express-checkout&token="
	Else
		gv_APIEndpoint = "https://payflowpro.paypal.com"
		PAYPAL_URL = "https://www.paypal.com/cgi-bin/webscr?cmd=_express-checkout&token="
	End If 
		
	'WinObjHttp Request proxy settings.
	gv_ProxyServer	= "127.0.0.1"
	gv_ProxyServerPort = "808"
	gv_Proxy		= 2	'setting for proxy activation
	gv_UseProxy		= False
	
	'-------------------------------------------------------------------------------------------------------------------------------------------
	' Purpose: 	Prepares the parameters for the SetExpressCheckout API Call.
	' Inputs:  
	'		paymentAmount:  	Total value of the shopping cart
	'		currencyCodeType: 	Currency code value the PayPal API
	'		paymentType: 		paymentType has to be one of the following values: Sale or Order or Authorization
	'		returnURL:			the page where buyers return to after they are done with the payment review on PayPal
	'		cancelURL:			the page where buyers return to when they cancel the payment review on PayPal
	' Returns: 
	'		The NVP Collection object of the SetExpressCheckout call Response.
	'--------------------------------------------------------------------------------------------------------------------------------------------	
	Function CallShortcutExpressCheckout( paymentAmount, currencyCodeType, paymentType, returnURL, cancelURL) 

		'------------------------------------------------------------------------------------------------------------------------------------
		' Construct the parameter string that describes the SetExpressCheckout API call in the shortcut implementation
		'------------------------------------------------------------------------------------------------------------------------------------
		
		nvpstr	= "&TENDER=P&ACTION=S&AMT=" & paymentAmount & _
				  "&CURRENCY=" & currencyCodeType & _
				  "&RETURNURL=" & returnURL & _
				  "&CANCELURL=" & cancelURL
		
		If "Authorization" = paymentType then
			nvpstr = nvpstr & "&TRXTYPE=A"
		Else 'default to sale
			nvpstr = nvpstr & "&TRXTYPE=S"
		End If

		SESSION("currencyCodeType")	= currencyCodeType	  
		SESSION("PaymentType")	= paymentType

		'Each part of Express Checkout must have a unique request ID.
		Set TypeLib = CreateObject("Scriptlet.TypeLib")
		
		'--------------------------------------------------------------------------------------------------------------- 
		' Make the API call to Payflow
		' If the API call succeded, then redirect the buyer to PayPal to begin to authorize payment.  
		' If an error occured, show the resulting errors
		'---------------------------------------------------------------------------------------------------------------
		Set resArray = hash_call(nvpstr,TypeLib.Guid)
		
		ack = UCase(resArray("RESULT"))
		If ack="0" Then
			' Save the token parameter in the Session 
			SESSION("token") = resArray("TOKEN")
		End If

		set CallShortcutExpressCheckout	= resArray	
		
	End Function

	'-------------------------------------------------------------------------------------------------------------------------------------------
	' Purpose: 	Prepares the parameters for the mark implementation of SetExpressCheckout
	' Inputs:  
	'		paymentAmount:  	Total value of the shopping cart
	'		currencyCodeType: 	Currency code value the PayPal API
	'		paymentType: 		paymentType has to be one of the following values: Sale or Order or Authorization
	'		returnURL:			the page where buyers return to after they are done with the payment review on PayPal
	'		cancelURL:			the page where buyers return to when they cancel the payment review on PayPal
	'		shipToName:		the Ship to name entered on the merchant's site
	'		shipToStreet:		the Ship to Street entered on the merchant's site
	'		shipToCity:			the Ship to City entered on the merchant's site
	'		shipToState:		the Ship to State entered on the merchant's site
	'		shipToCountryCode:	the Code for Ship to Country entered on the merchant's site
	'		shipToZip:			the Ship to ZipCode entered on the merchant's site
	'		shipToStreet2:		the Ship to Street2 entered on the merchant's site
	'		phoneNum:			the phoneNum  entered on the merchant's site
	' Returns: 
	'		The NVP Collection object of the SetExpressCheckout call Response.
	'--------------------------------------------------------------------------------------------------------------------------------------------	
	Function CallMarkExpressCheckout(paymentAmount, currencyCodeType, paymentType, returnURL, cancelURL, shipToName, shipToStreet, shipToCity, shipToState, shipToCountryCode, shipToZip, shipToStreet2, phoneNum) 
		'------------------------------------------------------------------------------------------------------------------------------------
		' Construct the parameter string that describes the SetExpressCheckout API call in the shortcut implementation
		'------------------------------------------------------------------------------------------------------------------------------------

		nvpstr = "&TENDER=P&ACTION=S"
		If "Authorization" = paymentType then
			nvpstr = nvpstr & "&TRXTYPE=A"
		Else 'default to sale
			nvpstr = nvpstr & "&TRXTYPE=S"
		End If
		
		nvpstr = nvpstr & "&AMT=" & paymentAmount & _
				  "&CURRENCY=" & currencyCodeType & _
				  "&RETURNURL=" & returnURL & _
				  "&CANCELURL=" & cancelURL & _ 
				  "&ADDROVERRIDE=1" & _ 
				  "&SHIPTOSTREET=" & shipToStreet & _ 
				  "&SHIPTOSTREET2=" & shipToStreet2 & _ 
				  "&SHIPTOCITY=" & shipToCity & _ 
				  "&SHIPTOSTATE=" & shipToState & _ 
				  "&SHIPTOCOUNTRY=" & shipToCountryCode & _ 
				  "&SHIPTOZIP=" & shipToZip

  	    SESSION("currencyCodeType")	= currencyCodeType	  
		SESSION("PaymentType")	= paymentType

		'Each part of Express Checkout must have a unique request ID.
		Set TypeLib = CreateObject("Scriptlet.TypeLib")
		
		'--------------------------------------------------------------------------- 
		' Make the API call to PayPal to set the Express Checkout token
		' 	If the API call succeded, then redirect the buyer to PayPal to begin to authorize payment.  
		' 	If an error occured, show the resulting errors
		'---------------------------------------------------------------------------
		Set resArray = hash_call(nvpstr,TypeLib.Guid)
		
		ack = UCase(resArray("RESULT"))
		If ack="0" Then
			' Save the token parameter in the Session 
			SESSION("token") = resArray("TOKEN")
		End If

		set CallMarkExpressCheckout	= resArray	

	End Function
	
	'-------------------------------------------------------------------------------------------------------------------------------------------
	' Purpose: 	Prepares the parameters for GetExpressCheckoutDetails.
	'
	' Inputs:  
	'		token: 	The token value returned by the SetExpressCheckout call
	' Returns: 
	'		The NVP Collection object of the GetExpressCheckoutDetails response.
	'--------------------------------------------------------------------------------------------------------------------------------------------	
	Function GetShippingDetails( token )
		'---------------------------------------------------------------------------
		' At this point, the buyer has completed authorizing the payment
		' at PayPal.  The function will call PayPal to obtain the details
		' of the authorization, incuding any shipping information of the
		' buyer.  Remember, the authorization is not a completed transaction
		' at this state - the buyer still needs an additional step to finalize
		' the transaction
		'---------------------------------------------------------------------------
		
	    '---------------------------------------------------------------------------
		' Build a second API request to Payflow, using the token as the
		'  ID to get the details on the payment authorization
		'---------------------------------------------------------------------------
		paymentType = SESSION("PaymentType")
	    nvpstr = "&TOKEN=" & token & "&TENDER=P&ACTION=G"
		If "Authorization" = paymentType then
			nvpstr = nvpstr & "&TRXTYPE=A"
		Else 'default to sale
			nvpstr = nvpstr & "&TRXTYPE=S"
		End If
		
		'Each part of Express Checkout must have a unique request ID.
		Set TypeLib = CreateObject("Scriptlet.TypeLib")
		
		'---------------------------------------------------------------------------
		' Make the API call and store the results in an array.  
		'	If the call was a success, show the authorization details, and provide
		' 	an action to complete the payment.  
		'	If failed, show the error
		'---------------------------------------------------------------------------
		set resArray = hash_call(nvpstr,TypeLib.Guid)
		ack = UCase(resArray("RESULT"))
		If ack="0" Then
			' Save the token parameter in the Session 
			SESSION("PAYERID") = resArray("PAYERID")
		End If		
		set GetShippingDetails = resArray
	End Function
	
	'-------------------------------------------------------------------------------------------------------------------------------------------
	' Purpose: 	Prepares the parameters for DoExpressCheckoutPayment.
	'
	' Inputs:  
	'		finalPaymentAmount:  	The final total of the shopping cart including Shipping, Handling and other fees
	' Returns: 
	'		The NVP Collection object of the DoExpressCheckoutPayment response.
	' Note:
	'       There are other optional parameters that can be passed to DoExpressCheckoutPayment that are not used here.
	'       See TABLE A.7 in https://cms.paypal.com/cms_content/US/en_US/files/developer/PFP_ExpressCheckout_PP.pdf for details on the optional parameters.
	'--------------------------------------------------------------------------------------------------------------------------------------------	
	Function ConfirmPayment( finalPaymentAmount )
	
		'------------------------------------------------------------------------------------------------------------------------------------
		'----	Use the values stored in the session from the previous SetEC call	
		'------------------------------------------------------------------------------------------------------------------------------------
		token			= SESSION("token")
		currCodeType	= SESSION("currencyCodeType")
		paymentType		= SESSION("PaymentType")
		payerID			= SESSION("PayerID")

		nvpstr = "&TENDER=P&ACTION=D"
		If "Authorization" = paymentType then
			nvpstr = nvpstr & "&TRXTYPE=A"
		Else 'default to sale
			nvpstr = nvpstr & "&TRXTYPE=S"
		End If
		
		nvpstr = nvpstr & "&TOKEN=" & token & "&PAYERID=" & payerID & "&AMT=" & finalPaymentAmount & "&CURRENCY=" & currCodeType
		
		' Each part of Express Checkout must have a unique request ID.
		' Save it as a session variable in order to avoid duplication
		Set TypeLib = CreateObject("Scriptlet.TypeLib")
		unique_id = SESSION("unique_id")
		If unique_id = "" then
			unique_id = TypeLib.Guid
			SESSION("unique_id") = unique_id
		End If
		
		'-------------------------------------------------------------------------------------------
		' Make the call to PayPal to finalize payment
		' If an error occured, show the resulting errors
		'-------------------------------------------------------------------------------------------
		set ConfirmPayment = hash_call(nvpstr,unique_id)
	End Function

	'-------------------------------------------------------------------------------------------------------------------------------------------
	' Purpose: 	Prepares the parameters for direct payment (credit card) and makes the call.
	'
	' Inputs:  
	'		paymentType: 		paymentType has to be one of the following values: Sale or Order
	'		paymentAmount:  	Total value of the shopping cart
	'		creditCardType		Credit card type has to one of the following values: Visa or MasterCard or Discover or Amex or Switch or Solo 
	'		creditCardNumber	Credit card number
	'		expDate				Credit expiration date
	'		cvv2				CVV2
	'		firstName			Customer's First Name
	'		lastName			Customer's Last Name
	'		street				Customer's Street Address
	'		city				Customer's City
	'		state				Customer's State				
	'		zip					Customer's Zip					
	'		countryCode			Customer's Country represented as a PayPal CountryCode
	'		currencyCode		Customer's Currency represented as a PayPal CurrencyCode
	'		orderdescription	Short textual description of the order
	'
	' Note:
	'		There are other optional inputs for credit card processing that are not presented here.
	'		For a complete list of inputs available, please see the documentation here for US and UK:
	'		https://cms.paypal.com/cms_content/US/en_US/files/developer/PP_PayflowPro_Guide.pdf
	'		https://cms.paypal.com/cms_content/GB/en_GB/files/developer/PP_WebsitePaymentsPro_IntegrationGuide_UK.pdf
	'		
	' Returns: 
	'		The NVP Collection object of the Response.
	'--------------------------------------------------------------------------------------------------------------------------------------------	
	
	Function DirectPayment( paymentType, paymentAmount, creditCardType, creditCardNumber, expDate, cvv2, firstName, lastName, street, city, state, zip, countryCode, currencyCode, orderdescription )
		' Construct the parameter string that describes the credit card payment
		nvpstr = "&TENDER=C"
		If "Authorization" = paymentType then
			nvpstr = nvpstr & "&TRXTYPE=A"
		Else 'default to sale
			nvpstr = nvpstr & "&TRXTYPE=S"
		End If

		'unique request ID
		Set TypeLib = CreateObject("Scriptlet.TypeLib")
		unique_id = TypeLib.Guid

		nvpstr = nvpstr & "&ACCT=" & creditCardNumber & "&CVV2=" & cvv2 & "&EXPDATE=" & expDate & "&ACCTTYPE=" & creditCardType
		nvpstr = nvpstr & "&AMT=" & paymentAmount & "&CURRENCY=" & currencyCode
		nvpstr = nvpstr & "&FIRSTNAME=" & firstName & "&LASTNAME=" & lastName & "&STREET=" & street & "&CITY=" & city
		nvpstr = nvpstr & "&STATE=" & state & "&ZIP=" & zip & "&COUNTRY=" & countryCode
		nvpstr = nvpstr & "&INVNUM=" & unique_id & "&ORDERDESC=" & orderdescription
		' Transaction results (especially values for declines and error conditions) returned by each PayPal-supported
		' processor vary in detail level and in format. The Payflow Verbosity parameter enables you to control the kind
		' and level of information you want returned. 
		' By default, Verbosity is set to LOW. A LOW setting causes PayPal to normalize the transaction result values. 
		' Normalizing the values limits them to a standardized set of values and simplifies the process of integrating 
		' the Payflow SDK.
		' By setting Verbosity to MEDIUM, you can view the processor’s raw response values. This setting is more “verbose”
		' than the LOW setting in that it returns more detailed, processor-specific information. 
		' Review the chapter in the Developer's Guides regarding VERBOSITY and the INQUIRY function for more details.
		' Set the transaction verbosity to MEDIUM.
		nvpstr = nvpstr & "&VERBOSITY=MEDIUM"

		'-------------------------------------------------------------------------------------------
		' Make the call to Payflow to finalize payment
		' If an error occured, show the resulting errors
		'-------------------------------------------------------------------------------------------
		set DirectPayment = hash_call(nvpstr,unique_id)
	End Function
	
	
	'----------------------------------------------------------------------------------
	' Purpose: 	Make the API call to PayPal, using API signature.
	' Inputs:  
	'		Method name to be called & NVP string to be sent with the post method
	' Returns: 
	'		NVP Collection object of Call Response.
	'----------------------------------------------------------------------------------	
	Function hash_call ( nvpStr, unique_id )
		Set objHttp = Server.CreateObject("WinHTTP.WinHTTPRequest.5.1")

		nvpStrComplete = "USER=" & gv_APIUser & "&VENDOR=" & gv_APIVendor & "&PARTNER=" & gv_APIPartner & "&PWD=" & gv_APIPassword & nvpStr 
		nvpStrComplete	= nvpStrComplete & "&BUTTONSOURCE=" & Server.URLEncode( gv_BNCode )
		
		Set SESSION("nvpReqArray")= deformatNVP( nvpStrComplete )
		objHttp.open "POST", gv_APIEndpoint, False
		WinHttpRequestOption_SslErrorIgnoreFlags=4
		objHttp.Option(WinHttpRequestOption_SslErrorIgnoreFlags) = &H3300
		
		objHttp.SetRequestHeader "Content-Type", "text/namevalue"
		objHttp.SetRequestHeader "Content-Length", Len(nvpStrComplete)
		objHttp.SetRequestHeader "X-VPS-CLIENT-TIMEOUT", "45" 
		objHttp.SetRequestHeader "X-VPS-REQUEST-ID", unique_id 
		' set the host header
		If Env = "pilot" Then
			objHttp.SetRequestHeader "Host", "pilot-payflowpro.paypal.com"
		Else
			objHttp.SetRequestHeader "Host", "payflowpro.paypal.com"
		End If
		
		If gv_UseProxy Then
			'Proxy Call
			objHttp.SetProxy gv_Proxy,  gv_ProxyServer& ":" &gv_ProxyServerPort
		End If
		
		objHttp.Send nvpStrComplete
				
		Set nvpResponseCollection = deformatNVP(objHttp.responseText)
		Set hash_call = nvpResponseCollection
		Set objHttp = Nothing 
		
		If Err.Number <> 0 Then 
			SESSION("Message")	= ErrorFormatter(Err.Description,Err.Number,Err.Source,"hash_call")
			SESSION("nvpReqArray") =  Null
		Else
			SESSION("Message")	= Null
		End If
	End Function

	'----------------------------------------------------------------------------------
	' Purpose: 	Formats the error Messages.
	' Inputs:  
	'		
	' Returns: 
	'		Formatted Error string
	'----------------------------------------------------------------------------------
	Function ErrorFormatter ( errDesc, errNumber, errSource, errlocation )
		ErrorFormatter ="<font color=red>" & _
								"<TABLE align = left>" &_
								"<TR>" &"<u>Error Occured!!!</u>" & "</TR>" &_
								"<TR>" &"<TD>Error Description :</TD>" &"<TD>"&errDesc& "</TD>"& "</TR>" &_
								"<TR>" &"<TD>Error number :</TD>" &"<TD>"&errNumber& "</TD>"& "</TR>" &_
								"<TR>" &"<TD>Error Source :</TD>" &"<TD>"&errSource& "</TD>"& "</TR>" &_
								"<TR>" &"<TD>Error Location :</TD>" &"<TD>"&errlocation& "</TD>"& "</TR>" &_
								"</TABLE>" &_
								"</font>"
	End Function 

	'----------------------------------------------------------------------------------
	' Purpose: 	Convert nvp string to Collection object.
	' Inputs:  	
	'		NVP string.
	' Returns: 
	'		NVP Collection object created from deserializing the NVP string.
	'----------------------------------------------------------------------------------
	Function deformatNVP ( nvpstr )
		On Error Resume Next
		
		Dim AndSplitedArray,EqualtoSplitedArray,Index1,Index2,NextIndex

		Set NvpCollection = Server.CreateObject("Scripting.Dictionary")
		AndSplitedArray = Split(nvpstr, "&", -1, 1)
		NextIndex=0

		For Index1 = 0 To UBound(AndSplitedArray)
			EqualtoSplitedArray=Split(AndSplitedArray(Index1), "=", -1, 1)
			For Index2 = 0 To UBound(EqualtoSplitedArray)
				NextIndex=Index2+1
				NvpCollection.Add URLDecode(EqualtoSplitedArray(Index2)),URLDecode(EqualtoSplitedArray(NextIndex))
				Index2=Index2+1
			Next
		Next
		Set deformatNVP = NvpCollection
		If Err.Number <> 0 Then 
			SESSION("Message")	= ErrorFormatter(Err.Description,Err.Number,Err.Source,"deformatNVP")
		else
			SESSION("Message")	= Null
		End If
	End Function

	'----------------------------------------------------------------------------------
	' Purpose: URL Encodes a string
	' Inputs:  
	'		String to be url encoded.
	' Returns: 
	'		Url Encoded string.
	'----------------------------------------------------------------------------------
	Function URLEncode(str) 
		On Error Resume Next

	    Dim AndSplitedArray,EqualtoSplitedArray,Index1,Index2,UrlEncodeString,NvpUrlEncodeString

		AndSplitedArray = Split(nvpstr, "&", -1, 1)
		UrlEncodeString=""
		NvpUrlEncodeString=""

		For Index1 = 0 To UBound(AndSplitedArray)
			EqualtoSplitedArray=Split(AndSplitedArray(Index1), "=", -1, 1)
			For Index2 = 0 To UBound(EqualtoSplitedArray)
			If Index2 = 0 then
				UrlEncodeString=UrlEncodeString & Server.URLEncode(EqualtoSplitedArray(Index2))
			Else			
				UrlEncodeString=UrlEncodeString &"="& Server.URLEncode(EqualtoSplitedArray(Index2))
			End if
			Next
			If Index1 = 0 then
				NvpUrlEncodeString= NvpUrlEncodeString & UrlEncodeString
			Else			
				NvpUrlEncodeString= NvpUrlEncodeString &"&"&UrlEncodeString
			End if
			UrlEncodeString=""
		Next
		URLEncode = NvpUrlEncodeString
		
		If Err.Number <> 0 Then 
			SESSION("Message")	= ErrorFormatter(Err.Description,Err.Number,Err.Source,"URLEncode")
		else
			SESSION("Message")	= Null
		End If
		
	 End Function 

	'----------------------------------------------------------------------------------
	' Purpose: Decodes a URL Encoded string
	' Inputs:  
	'		A URL encoded string
	' Returns: 
	'		Decoded string.
	'----------------------------------------------------------------------------------
	Function URLDecode(str) 
		On Error Resume Next
		
		str = Replace(str, "+", " ") 
		For i = 1 To Len(str) 
			sT = Mid(str, i, 1) 
			If sT = "%" Then 
				If i+2 < Len(str) Then 
					sR = sR & _ 
						Chr(CLng("&H" & Mid(str, i+1, 2))) 
					i = i+2 
				End If 
			Else 
				sR = sR & sT 
			End If 
		Next 
	       
		URLDecode = sR 
		If Err.Number <> 0 Then 
			SESSION("Message")	= ErrorFormatter(Err.Description,Err.Number,Err.Source,"URLDecode")
		else
			SESSION("Message")	= Null
		End If

	End Function

	'----------------------------------------------------------------------------------
	' Purpose: 	It's Workaround Method for Response.Redirect
	'          	It will redirect the page to the specified url without urlencoding
	' Inputs: 
	'		Url to redirect the page
	'----------------------------------------------------------------------------------
	Function ReDirectURL( token )
		On Error Resume Next

		payPalURL = PAYPAL_URL & token
		response.clear
		response.status="302 Object moved"
		response.AddHeader "location", payPalURL
		If Err.Number <> 0 Then 
			SESSION("Message")	= ErrorFormatter(Err.Description,Err.Number,Err.Source,"ReDirectURL")
		else
			SESSION("Message")	= Null
		End If
	End Function	
	
%>
<% SetLocale("en-us") 

CustID=Request.QueryString("CustID") 

%>
<html>

<head>

<!--#Include virtual="/AlpacaRanchquest/GlobalVariables.asp"-->

<%conn = "Provider=Microsoft.Jet.OLEDB.4.0;" & _
						"Data Source=" & server.mappath(DatabasePath) & ";" & _
						"User Id=;Password=;" '& _ 
		
			Set rs = Server.CreateObject("ADODB.Recordset")
			
			 sql = "select * from RanchPages where custID= " & CustID
				'response.write(sql)
				rs.Open sql, conn, 3, 3
				If not rs.eof Then
						Logo = rs("Logo")
						Header = rs("Header")
						MenuBackgroundColor = rs("MenuBackgroundColor")
						MenuColor = rs("MenuColor")
						MenuFontMouseOverColor = rs("MenuFontMouseOverColor")
						TitleColor = rs("TitleColor")
						PageBackgroundColor = rs("PageBackgroundColor")
						PageTextColor = rs("PageTextColor")
						LayoutStyle = rs("LayoutStyle")
			
				End If
			rs.close

		%>
<style>
		H1 {font: 24pt arial; color: <%=TitleColor %>}
		H2 {font: 20pt arial; color: <%=TitleColor %>}
		H3 {font: 18pt arial; color: <%=TitleColor %>}
		.Body {font: 10pt arial; color: <%=PageTextColor %>}
		A.Body {font: 10pt arial; color: <%=PageTextColor %>}
</style>


	<%		Set rs = Server.CreateObject("ADODB.Recordset")
			
			sql = "select  SfCustomers.* from SFCustomers where SFCustomers.custID= " & CustID
				'response.write(sql)
				rs.Open sql, conn, 3, 3
				If not rs.eof then
				 WebLink = rs("WebLink")
				 'response.write(WebLink)
	
	PageText1 = rs("RanchProductsText")
	 Image1= rs("RanchProductsImage")

			Productsheading= rs("RanchProductsheading")

				   custFirstName = rs("custFirstName")
				   custMiddleInitial  = rs("custMiddleInitial")
					custLastName  = rs("custLastName")
					custCompany   = rs("custCompany")
					custAddr1  = rs("custAddr1")
					custAddr2  = rs("custAddr2")
					custCity  = rs("custCity")
					custState   = rs("custState")
					custZip   = rs("custZip")
					custCountry   = rs("custCountry")
					custPhone   = rs("custPhone")
					custPhone2   = rs("custPhone2")
					custFAX   = rs("custFAX")
					Logo   = rs("Logo")
					Header   = rs("Header")

str1 = PageText1
str2 = vblf
If InStr(str1,str2) > 0 Then
	PageText1= Replace(str1, str2 , "</br>")
End If  

str1 = PageText1
str2 = vbtab
If InStr(str1,str2) > 0 Then
	PageText1= Replace(str1, str2 , "&nbsp;&nbsp;&nbsp;&nbsp;")
End If  

str1 = PageText2
str2 = vblf
If InStr(str1,str2) > 0 Then
	PageText2= Replace(str1, str2 , "</br>")
End If  

str1 = PageText2
str2 = vbtab
If InStr(str1,str2) > 0 Then
	PageText2= Replace(str1, str2 , "&nbsp;&nbsp;&nbsp;&nbsp;")
End If  
str1 = PageText3
str2 = vblf
If InStr(str1,str2) > 0 Then
	PageText3= Replace(str1, str2 , "</br>")
End If  

str1 = PageText3
str2 = vbtab
If InStr(str1,str2) > 0 Then
	PageText3= Replace(str1, str2 , "&nbsp;&nbsp;&nbsp;&nbsp;")
End If  

str1 = PageText4
str2 = vblf
If InStr(str1,str2) > 0 Then
	PageText4= Replace(str1, str2 , "</br>")
End If  

str1 = PageText4
str2 = vbtab
If InStr(str1,str2) > 0 Then
	PageText4= Replace(str1, str2 , "&nbsp;&nbsp;&nbsp;&nbsp;")
End If  

					str1 = WebLink
					str2 = "http://"
					If InStr(str1,str2) > 0 Then
							WebLink= Replace(str1,  str2, "")
					End If 

				rs.close
			End If 


			 If Not(ImageOrientation1 = "Left") then
					 ImageOrientation1 = "Right"
					
			End if

			%>


<title><%= custCompany %> - Alpaca Products for Sale</title>
<meta name="description" content="About <%= custCompany %>">
<META name="keywords" content="About <%= custCompany %>, <%=State%> Alpaca Ranch, <%= WebSiteName %>, <%= Slogan %>, <%= Breed %>Alpacas, alpacas, alpaca,  female alpacas, male alpacas">
<meta name="author" content="WebArtists.biz">
<link rel="shortcut icon" href="/infinityknot.ico" /> 
<link rel="icon" href="http://www.alpacainfinity.com/infinityknot.ico" /> 
<link rel="stylesheet" type="text/css" href="ARQStyle.css">


</head>
<BODY border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"   >


<!--#Include file="RanchHeader.asp"-->
  
		<!--#Include file="RanchProductsinclude.asp"-->		
							

 <!--#Include file="ranchFooter.asp"--> 
</body>
</html>


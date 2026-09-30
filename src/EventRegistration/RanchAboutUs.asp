<% SetLocale("en-us") 

CustID=Request.QueryString("CustID") 

%>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
	"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">
<head>
<!--#Include file="GlobalVariables.asp"-->
<%	conn = "Provider=Microsoft.Jet.OLEDB.4.0;" & _
	"Data Source=" & server.mappath(DatabasePath) & ";" & _
	"User Id=;Password=;" '& _ 
	Set rs = Server.CreateObject("ADODB.Recordset")
sql = "select  SfCustomers.* from SFCustomers where SFCustomers.custID= " & CustID
rs.Open sql, conn, 3, 3
If not rs.eof then
	PageText1 = rs("RanchAboutUsText")	
	custCompany   = rs("custCompany")
	custState   = rs("custState")
end if 
rs.close%>

<title>About <%=custCompany%>  - <%=custState%> Alpaca Farm / Alpaca Ranch</title>
<META name="Title" content="About <%=custCompany%>  - <%=custState%> Alpaca Farm / Alpaca Ranch">
<META name="description" content="<%=PageText1 %>" />
<META name="keywords" content="<%=custCompany%> ,
<%=custState%> alpacas for sale,
<%=custState%> Alpacas,
<%=custState%> Alpaca Farm,
<%=custState%> Alpaca Ranch, 
Alpacas for sale, 
Alpacas">
<meta name="robots" content="index,follow"/>
<meta name="rating" content="Safe for kids"/>
<meta name="revisit-after" content="1"/>
<meta name="Googlebot" content="index,follow"/>
<meta name="robots" content="All"/>

<link rel="shortcut icon" href="/infinityknot.ico" /> 
<link rel="icon" href="http://www.alpacainfinity.com/alpacachamps/infinityknot.ico" /> 

<meta name="subjects" content="Alpaca ranches, Alpaca farms, Alpacas for Sale, Alpaca Products, Alpaca Fleece" />
<link rel="stylesheet" type="text/css" href="ARQstyle.css">

<% sql = "select * from RanchPages where custID= " & CustID
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
	RanchAboutUsText = rs("RanchAboutUsText")
 
	PageText1 = rs("RanchAboutUsText")
	 PageText2 = rs("RanchAboutUsText2")
	 PageText3 = rs("RanchAboutUsText3")
	 PageText4 = rs("RanchAboutUsText4")
	 Image1= rs("RanchAboutUsImage1")
	Image2= rs("RanchAboutUsImage2")
	 Image3= rs("RanchAboutUsImage3")
	 Image4= rs("RanchAboutUsImage4")
	 ImageOrientation1= rs("RanchAboutUsImageOrientation1")
	ImageOrientation2= rs("RanchAboutUsImageOrientation2")
	 ImageOrientation3= rs("RanchAboutUsImageOrientation3")
		ImageOrientation4= rs("RanchAboutUsImageOrientation4")
			Aboutusheading= rs("Aboutusheading")

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
str1 = Aboutusheading
str2 = vblf
If InStr(str1,str2) > 0 Then
	Aboutusheading= Replace(str1, str2 , "</br>")
End If  

str1 = Aboutusheading
str2 = vbtab
If InStr(str1,str2) > 0 Then
	Aboutusheading= Replace(str1, str2 , "&nbsp;&nbsp;&nbsp;&nbsp;")
End If  
				rs.close
			End If 


			 If Not(ImageOrientation1 = "Left") then
					 ImageOrientation1 = "Right"
					
			End if
 'ImageOrientation1= rs("RanchAboutUsImageOrientation1")
'	ImageOrientation2= rs("RanchAboutUsImageOrientation2")
'	 ImageOrientation3= rs("RanchAboutUsImageOrientation3")
	'	ImageOrientation4= rs("RanchAboutUsImageOrientation4")
			%>



</head>
<BODY border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"   >


<!--#Include file="RanchHeader.asp"-->
  
								<!--#Include file="RanchAboutUsInclude.asp"--> 
							

 <!--#Include file="ranchFooter.asp"--> 
</body>
</html>


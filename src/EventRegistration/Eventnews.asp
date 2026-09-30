

<% SetLocale("en-us") 
CustID=Request.Form("CustID") 
If CustId = "notselected" Then
	Response.Redirect("Ranches.asp")
End if
If Not Len(CustID)> 0 Then 
	CustID=Request.QueryString("CustID") 
End if

conn = "Provider=Microsoft.Jet.OLEDB.4.0;" & _
						"Data Source=" & server.mappath("../../DB/alpaca_infinity_animals.mdb") & ";" & _
						"User Id=;Password=;" '& _ 

Set rs = Server.CreateObject("ADODB.Recordset")
sql = "select  SfCustomers.* from SFCustomers where SFCustomers.custID= " & CustID
rs.Open sql, conn, 3, 3
If not rs.eof then
	WebLink = rs("WebLink")
	custFirstName = rs("custFirstName")
	custCompany   = rs("custCompany")
	News = rs("RanchHomeText2")
End if
rs.close
%>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
	"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">
<head>
<title><%= custCompany %> News - Alpacas News</title>
<META name="Title" content="<%= custCompany %> News">
<META name="description" content="<%=Left(News, 200) %> " />
<META name="keywords" content="<%= custCompany %>, News, <%= custState %>alpaca ranch">
<meta name="robots" content="index,follow"/>
<meta name="rating" content="Safe for kids"/>
<meta name="revisit-after" content="1"/>
<meta name="Googlebot" content="index,follow"/>
<meta name="robots" content="All"/>
<link rel="shortcut icon" href="/infinityknot.ico" /> 
<link rel="icon" href="http://www.alpacainfinity.com/alpacachamps/infinityknot.ico" /> 
<meta name="subjects" content="Alpaca ranches, Alpaca farms, Alpaca News" />
<link rel="stylesheet" type="text/css" href="ARQStyle.css">


<!--#Include file="GlobalVariables.asp"-->

<% conn = "Provider=Microsoft.Jet.OLEDB.4.0;" & _
		"Data Source=" & server.mappath(DatabasePath) & ";" & _
		"User Id=;Password=;" '& _ 
		
		Set rs = Server.CreateObject("ADODB.Recordset")
			
		sql = "select * from RanchPages where custID= " & CustID
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
			PageTextMouseOverColor = rs("PageTextMouseOverColor")
End If
rs.close

		%>
<style>
		H1 {font: 24pt arial; color: <%=TitleColor %>}
		H2 {font: 20pt arial; color: <%=TitleColor %>}
		H3 {font: 18pt arial; color: <%=TitleColor %>}
		.Body {font: 10pt arial; color: <%=PageTextColor %>}
		A.Body {font: 10pt arial; color: <%=PageTextColor %>}
		A.Body:hover { color: <%=PageTextMouseOverColor%>}
			.Heading {font: 10pt arial; color: <%=PageTextColor %>}
		A.Heading {font: 10pt arial; color: <%=MenuFontMouseOverColor %>}
</style>


	<%		Set rs = Server.CreateObject("ADODB.Recordset")
			
			sql = "select  SfCustomers.* from SFCustomers where SFCustomers.custID= " & CustID
				'response.write(sql)
				rs.Open sql, conn, 3, 3
				If not rs.eof then
				 WebLink = rs("WebLink")
				 'response.write(WebLink)

 custFirstName = rs("custFirstName")
custMiddleInitial  = rs("custMiddleInitial")
custLastName  = rs("custLastName")
custAddr1  = rs("custAddr1")
custAddr2  = rs("custAddr2")
custCity  = rs("custCity")
custZip   = rs("custZip")
custCountry   = rs("custCountry")
custPhone   = rs("custPhone")
custPhone2   = rs("custPhone2")
custFAX   = rs("custFAX")
Logo   = rs("Logo")
Header   = rs("Header")
Weblink   = rs("Weblink")
	 Image1= rs("RanchHomeImage1")
	Image2= rs("RanchHomeImage2")
	 Image3= rs("RanchHomeImage3")
	 Image4= rs("RanchHomeImage4")
	 ImageOrientation1= rs("RanchHomeImageOrientation1")
	ImageOrientation2= rs("RanchHomeImageOrientation2")
	 ImageOrientation3= rs("RanchHomeImageOrientation3")
	ImageOrientation4= rs("RanchHomeImageOrientation4")
	RanchHomeheading= rs("RanchHomeheading")

str1 =News
str2 = vblf
If InStr(str1,str2) > 0 Then
	News= Replace(str1, str2 , "</br>")
End If  

str1 = News
str2 = vbtab
If InStr(str1,str2) > 0 Then
	News= Replace(str1, str2 , "&nbsp;&nbsp;&nbsp;&nbsp;")
End If  

str1 = WebLink
str2 = "http://"
If InStr(str1,str2) > 0 Then
	WebLink= Replace(str1,  str2, "")
End If 

rs.close
End If 

%>

</head>
<BODY border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"   >

<!--#Include file="RanchHeader.asp"-->
  <% If LayoutStyle = "Landscape" Then
		Tablewidth = "700"
 Else
 Tablewidth = "600"

 End If %>
<br>
<table width = "<%=Tablewidth%>" border="0"  cellspacing="3" cellpadding="3" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0" height = "200" align = "center">						
<% If Len(News) > 12 Then %>
	<tr>
		<td class ="Heading" height = "25">
			<h1> <font color = "<%=PageTextColor%>"><%=CustCompany %> Ranch News</font></h1>
							
		</td>
						  
						  </tr>
							<tr>
								<td class ="body" height = "25">
								<% If Len(Image2) > 1 Then %>
										<img src = "<%=Image2%>" border = "0" align = "right" width = "200">
									<% End If %>
									
									<%=News%>
						   </td>
						  
						  </tr>
				<% End If %>

						 </table><br><br>

 <!--#Include file="RanchFooter.asp"--> 
</body>
</html>



<html>
<head>

<%  PageName = "Featured Artisan" %>
<!--#Include virtual="GlobalVariables.asp"-->
<!--#Include file="Scripts.asp"-->
<meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
<meta http-equiv="Content-Language" content="en-us">
<title><%= SEOTitle %> </title>
<META name="description" content="<%= SEODescription %> ">
<META name="keywords" content="<%= SEOKeyword1 %>, 
<%=SEOKeyword2%>, 
<%=SEOKeyword3 %>,
<%=SEOKeyword4 %>, 
<%=SEOKeyword5 %>, 
<%=SEOKeyword6 %>,  
<%=SEOKeyword7 %>, 
<%=SEOKeyword8 %>, 
<%=SEOKeyword9 %>, 
<%=SEOKeyword10 %>, 
<%=SEOKeyword11 %>, 
 <%=SEOKeyword12 %>, 
 <%=SEOKeyword13 %>, 
 <%=SEOKeyword14 %>, 
 <%=SEOKeyword15 %>, 
 <%=SEOKeyword16 %>, 
 <%=SEOKeyword17 %>, 
 <%=SEOKeyword18 %>, 
 <%=SEOKeyword19 %>, 
 <%=SEOKeyword20 %> ">


<meta name="author" content="WebArtists.biz">
<link rel="shortcut icon" href="<%=ShortIcon%>" /> 
<link rel="icon" href="<%=LongIcon%>" /> 
<meta name="author" content="WebArtists.biz">
<link rel="stylesheet" type="text/css" href="BarnStyle.css">


</head>

<BODY border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"   align = "center">

<!--#Include file="Header.asp"-->
<%conn = "Provider=Microsoft.Jet.OLEDB.4.0;" & _
						"Data Source=" & server.mappath(databasepath) & ";" & _
						"User Id=;Password=;" 


  sql = "select * from Featured where FeaturedID = 1"
'response.write(sql)
		
	Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3   

	If Not rs.eof Then
			ArtisanText= rs("ArtisanText")
			ArtisanImage= rs("ArtisanImage")
			ArtisanID= rs("ArtisanID")
			Imagecaption=rs("Imagecaption")

			str1 = ArtisanText
			str2 = vblf
		If InStr(str1,str2) > 0 Then
				ArtisanText= Replace(str1, str2 , "</br>")
		End If  

		str1 = ArtisanText
		str2 = vbtab
		If InStr(str1,str2) > 0 Then
			ArtisanText= Replace(str1, str2 , "&nbsp;&nbsp;&nbsp;&nbsp;")
		End If  

	End If 
	%>

		<table border = "0" width = "725"   leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0  align = "center" >
					<tr>
						<td colspan = "2"   height = "20"  >
							<h1>Featured Artisan: <%=rs("ArtisanName")%></H1>
						</td>
					</tr>
				<tr>
				<td class = "body" align ="left" bgcolor = "#670000" height = "1"><img src = "images/px.gif" height = "1"></td>
			</tr>
		</table>
				<table border = "0" width = "725"   leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=5  align = "center" >
			<tr>
				   <td class = "body"><%=ArtisanText %><br>
							<br>
							<center><a href = "OurGallery.asp?CustID=<%=ArtisanID%>" class = "body">Learn more about the featured artisan</big></a></center>
					</td>
					<% If Len(ArtisanImage) > 1 Then %>
					<td class = "body" valign = "top"><br>
									<img src = "<%=ArtisanImage %>"  valign = "top" width = "200"  border = "1">
									<center><%=Imagecaption%></center>
					</td>
				<% end if %>
			</tr>
		</table>

<br><br>

<!--#Include file="Footer.asp"-->



</body>
</html>
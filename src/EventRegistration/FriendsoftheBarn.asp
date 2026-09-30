
<html>
<head>

<%  PageName = "Friends of the Barn" %>
<!--#Include virtual="GlobalVariables.asp"-->
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
 <%=SEOKeyword20 %> "
 
 
 <%conn = "Provider=Microsoft.Jet.OLEDB.4.0;" & _
						"Data Source=" & server.mappath(DatabasePath) & ";" & _
						"User Id=;Password=;" '& _ 
			Set rs = Server.CreateObject("ADODB.Recordset")
			
			sql = "select * from  Pagelayout where PageName = '" & PageName & "'"
				'response.write(sql)
				rs.Open sql, conn, 3, 3
				If not rs.eof then

				
					PageTitle = rs("PageTitle")
					PageHeading1= rs("PageHeading1")
					PageHeading2= rs("PageHeading2")
					PageHeading3= rs("PageHeading3")
					PageHeading4= rs("PageHeading4")
									PageHeading5= rs("PageHeading5")
													PageHeading6= rs("PageHeading6")
																	PageHeading7= rs("PageHeading7")
					PageText1 = rs("PageText")
					PageText2 = rs("PageText2")
					PageText3 = rs("PageText3")
					PageText4 = rs("PageText4")
						PageText5 = rs("PageText5")
							PageText6 = rs("PageText6")
								PageText7 = rs("PageText7")
					Image1= rs("Image1")
					Image2= rs("Image2")
					Image3= rs("Image3")
					Image4= rs("Image4")
					Image5= rs("Image5")
					Image6= rs("Image6")
					Image7= rs("Image7")
					ImageCaption1= rs("ImageCaption1")
					ImageCaption2= rs("ImageCaption2")
					ImageCaption3= rs("ImageCaption3")
					ImageCaption4= rs("ImageCaption4")
					ImageCaption5= rs("ImageCaption5")
					ImageCaption6= rs("ImageCaption6")
					ImageCaption7= rs("ImageCaption7")
					ImageOrientation1= rs("ImageOrientation1")
					ImageOrientation2= rs("ImageOrientation2")
					ImageOrientation3= rs("ImageOrientation3")
					ImageOrientation4= rs("ImageOrientation4")
								ImageOrientation5= rs("ImageOrientation5")
											ImageOrientation6= rs("ImageOrientation6")
														ImageOrientation7= rs("ImageOrientation7")

				rs.close
			End If 
			%>


<meta name="author" content="WebArtists.biz">
<link rel="shortcut icon" href="<%=ShortIcon%>" /> 
<link rel="icon" href="<%=LongIcon%>" /> 
<meta name="author" content="WebArtists.biz">
<link rel="stylesheet" type="text/css" href="BarnStyle.css">


</head>

<BODY border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"   align = "center">

<!--#Include virtual="Header.asp"-->
<Table border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"   align = "center" valign = "top" width = "720">
		<tr>
				<td class = "body" align ="left">
					<br><h1><%=PageTitle %></h1>
				</td>
			</tr>
		<tr>
				<td class = "body" align ="left" bgcolor = "#670000" height = "1"><img src = "images/px.gif" height = "1"></td>
			</tr>
</table>
<table border="0" cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  align = "center"  width = "700" >
		     	<td  class = "body"><br>
					<h2><%=PageHeading1%></h2>
				<% If Len(Image1) > 2 then%>
						<img src = "<%=Image1 %>" border = "1" align = "right" valign = "top" width = "290">
					<% End If %>
				<%=PageText%>
			</td>
		</tr>
		<% If Len(PageText2) > 2 Or  Len(PageText3) > 2 Then %>
		<tr>
				<td class = "body" align ="left">
					<a name = "Featured"></a><br><h1>Featured Friends of the Barn</h1>
				</td>
			</tr>
		<tr>
				<td class = "body" align ="left" bgcolor = "#670000" height = "1"><img src = "images/px.gif" height = "1"></td>
			</tr>
		<% End If %>
		 <tr>
			<td class = "body">
			<%
			TempOrientation = ImageOrientation2
			TempImage = Image2
			TempImageCaption = ImageCaption2
			TempHeading = PageHeading2
			TempPageText = PageText2
			
			%>
			
			<!--#Include file="CaptionedPageTextInclude.asp"-->	
			
			</td>
		
		 <tr>
			<td class = "body">
			<%
			TempOrientation = ImageOrientation3
			TempImage = Image3
			TempImageCaption = ImageCaption3
			TempHeading = PageHeading3
			TempPageText = PageText3
			
			%>
			
			<!--#Include file="CaptionedPageTextInclude.asp"-->	
			
			</td>
		</tr>
		</tr>
			<tr>
				<td class = "body" align ="left">
					<br><h1>Complete List of Donors</h1>
				</td>
			</tr>
		<tr>
				<td class = "body" align ="left" bgcolor = "#670000" height = "1"><img src = "images/px.gif" height = "1"></td>
			</tr>
		 <tr>
			<td class = "body">
			<%
			TempOrientation = ImageOrientation4
			TempImage = Image4
			TempImageCaption = ImageCaption4
			TempHeading = PageHeading4
			TempPageText = PageText4
			
			%>
			
			<!--#Include file="CaptionedPageTextInclude.asp"-->	
			
			</td>
		</tr>
		 <tr>
			<td class = "body">
			<%
			TempOrientation = ImageOrientation5
			TempImage = Image5
			TempImageCaption = ImageCaption5
			TempHeading = PageHeading5
			TempPageText = PageText5
			
			%>
			
			<!--#Include file="CaptionedPageTextInclude.asp"-->	
			<br>
			</td>
		</tr>
		 <tr>
			<td class = "body">
			<%
			TempOrientation = ImageOrientation6
			TempImage = Image6
			TempImageCaption = ImageCaption6
			TempHeading = PageHeading6
			TempPageText = PageText6
			
			%>
			
			<!--#Include file="CaptionedPageTextInclude.asp"-->	
			
			</td>
		</tr>
		 <tr>
			<td class = "body">
			<%
			TempOrientation = ImageOrientation7
			TempImage = Image7
			TempImageCaption = ImageCaption7
			TempHeading = PageHeading7
			TempPageText = PageText7
			
			%>
			
			<!--#Include file="CaptionedPageTextInclude.asp"-->	
			
		
		 
		</td>
	</tr>
</table>


<!--#Include file="Footer.asp"-->
</body>
</html>

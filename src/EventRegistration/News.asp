
<html>
<head>

<%  PageName = "News" %>
<!--#Include file="GlobalVariables.asp"-->

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


<meta name="author" content="The Andresen Group">
<link rel="shortcut icon" href="<%=ShortIcon%>" /> 
<link rel="icon" href="<%=LongIcon%>" /> 
<meta name="author" content="The Andresen Group">
<link rel="stylesheet" type="text/css" href="BarnStyle.css">


<%conn = "Provider=Microsoft.Jet.OLEDB.4.0;" & _
						"Data Source=" & server.mappath(DatabasePath) & ";" & _
						"User Id=;Password=;" '& _ 
			Set rs = Server.CreateObject("ADODB.Recordset")
			
			sql = "select * from  Pagelayout where PageName = 'News'"
				'response.write(sql)
				rs.Open sql, conn, 3, 3
				If not rs.eof then

				Dim PageTitle
				Dim Pageheading(4)
				Dim NewsPageText(4)
				Dim Image(4)
				Dim Imagecaption(4)
				Dim ImageOrientation(4)
				Dim num

					PageTitle = rs("PageTitle")
					PageHeading(1)= rs("PageHeading1")
					PageHeading(2)= rs("PageHeading2")
					PageHeading(3)= rs("PageHeading3")
					PageHeading(4)= rs("PageHeading4")
					NewsPageText(1) = rs("PageText")
					NewsPageText(2) = rs("PageText2")
					NewsPageText(3) = rs("PageText3")
					NewsPageText(4) = rs("PageText4")
					Image(1)= rs("Image1")
					Image(2)= rs("Image2")
					Image(3)= rs("Image3")
					Image(4)= rs("Image4")
					ImageCaption(1)= rs("ImageCaption1")
					ImageCaption(2)= rs("ImageCaption2")
					ImageCaption(3)= rs("ImageCaption3")
					ImageCaption(4)= rs("ImageCaption4")
					ImageOrientation(1)= rs("ImageOrientation1")
					ImageOrientation(2)= rs("ImageOrientation2")
					ImageOrientation(3)= rs("ImageOrientation3")
					ImageOrientation(4)= rs("ImageOrientation4")

				rs.close
			End If 
			%>

</head>
<BODY border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"   align = "center">

<!--#Include file="Header.asp"-->

<Table border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"   align = "center" valign = "top" width = "720">
		<tr>
				<td class = "body" align ="left">
					<% If Len(PageTitle) > 1 Then %><br>
			<h1><%=PageTitle%></h1>
			<% Else %>
				<br><h1>News</h1>
			<% End if %>
				</td>
			</tr>
		<tr>
				<td class = "body" align ="left" bgcolor = "#670000" height = "1"><img src = "images/px.gif" height = "1"></td>
			</tr>
			<tr>
			   <td class = "body"><br>
			
				
					

				<% 	num = 1 %>
				 <!--#Include file="NewsContentinclude.asp"--> 
				 <% 	num = 2 %>
				 <!--#Include file="NewsContentinclude.asp"--> 
				<% 	num = 3 %>
				 <!--#Include file="NewsContentinclude.asp"--> 
				 <% 	num = 4 %>
				 <!--#Include file="NewsContentinclude.asp"--> 



	</td>
	</tr>
</table>


	</td>
	</tr>
</table>

 <!--#Include file="Footer.asp"--> 
</body>
</html>


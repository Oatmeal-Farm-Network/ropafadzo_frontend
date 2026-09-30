<% SetLocale("en-us") 

CustID=Request.QueryString("CustID") 

%>
<html>

<head>
<!--#Include virtual="GlobalVariables.asp"-->


<title><%= custCompany %></title>
<meta name="description" content="<%= custCompany %> Artist Page at ArtisanBarn.org">
<META name="keywords" content="<%= custCompany %>">
<meta name="author" content="The Andresen Group">
<link rel="stylesheet" type="text/css" href="BarnStyle.css">



</head>
<BODY border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"   >

<!--#Include virtual="Header.asp"-->

<!--#Include virtual="artistHeader.asp"-->

 <table   border="0" cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  align = "center"  valign ="top"   width = "650">
	<tr>
	     <td class = "body"  >
		   <% If Len(ArtisanHomeHeading) > 1 Then %>
			<h1><%=ArtisanHomeHeading%></h1>
			<% Else %>
				<br><h1><%= custFirstName%>&nbsp;<%= custLastName%></h1>
			<% End if %>
		</td>
	</tr>
	<tr>
						<td colspan = "2"   height = "1"   bgcolor = "#620000" ><img src = "images/px.gif". height = "1"></td>
					</tr>
	<tr>
		<td  class = "body" height = "300">
				
					<% If Len(ArtistHomeImage1) > 2 then%>
						<img src = "<%=ArtistHomeImage1%>" align = "<%=ArtisanHomeImageOrientation1%>" width = "250" border = "1">
					<% End If %>
					
					<%=ArtisanHomeText%><br><br>
</td>
</tr>
<tr>
  <td class = "body">
					<% If Len(ArtistHomeImage2) > 2 then%>
						<img src = "<%=ArtistHomeImage2%>" align = "<%=ArtisanHomeImageOrientation2%>" width = "250" border = "1">
					<% End If %>
					<% If Len(ArtisanHomeHeading2) > 2 then%>
						<h2><%=ArtisanHomeHeading2%></h2>
					<% End If %>
					<%=ArtisanHomeText2%><br><br>
</td>
</tr>
<tr>
  <td class = "body"><br>
				<% If Len(ArtistHomeImage3) > 2 then%>
						<img src = "<%=ArtistHomeImage3%>" align = "<%=ArtisanHomeImageOrientation3%>" width = "250" border = "1">
					<% End If %>
					<% If Len(ArtisanHomeHeading3) > 2 then%>
						<h2><%=ArtisanHomeHeading3%></h2>
					<% End If %>
					<%=ArtisanHomeText3%><br><br>
</td>
</tr>
<tr>
  <td class = "body">
					<% If Len(ArtistHomeImage4) > 2 then%>
						<img src = "<%=ArtistHomeImage4%>" align = "<%=ArtisanHomeImageOrientation4%>" width = "250" border = "1">
					<% End If %>
					<% If Len(ArtisanHomeHeading4) > 2 then%>
						<h2><%=ArtisanHomeHeading4%></h2>
					<% End If %>
					<%=ArtisanHomeText4%><br><br>
</td>
</tr>
<tr>
  <td class = "body">
					<% If Len(ArtistHomeImage5) > 2 then%>
						<img src = "<%=ArtistHomeImage5%>" align = "<%=ArtisanHomeImageOrientation5%>" width = "250" border = "1">
					<% End If %>
					<% If Len(ArtisanHomeHeading5) > 2 then%>
						<h2><%=ArtisanHomeHeading5%></h2>
					<% End If %>
					<%=ArtisanHomeText5%><br><br>
</td>
</tr>
<tr>
  <td class = "body">
					<% If Len(ArtistHomeImage6) > 2 then%>
						<img src = "<%=ArtistHomeImage6%>" align = "<%=ArtisanHomeImageOrientation6%>" width = "250" border = "1">
					<% End If %>
					<% If Len(ArtisanHomeHeading6) > 2 then%>
						<h2><%=ArtisanHomeHeading6%></h2>
					<% End If %>
					<%=ArtisanHomeText6%><br><br>
</td>
</tr>
<tr>
  <td class = "body">

					<% If Len(ArtistHomeImage7) > 2 then%>
						<img src = "<%=ArtistHomeImage7%>" align = "<%=ArtisanHomeImageOrientation7%>" width = "250" border = "1">
					<% End If %>
					<% If Len(ArtisanHomeHeading7) > 2 then%>
						<h2><%=ArtisanHomeHeading7%></h2>
					<% End If %>
					<%=ArtisanHomeText7%><br><br>



				
		</td>
	</tr>
</table>
	</td>
	</tr>
</table>
 <!--#Include virtual="Footer.asp"--> 
</body>
</html>


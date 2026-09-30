<html>
 <head>

 <!--#Include file="GlobalVariables.asp"-->
 <!--#Include file="ProductsDetailDBInclude.asp"--> 
<meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
<meta http-equiv="Content-Language" content="en-us">
<title><%= WebSiteName %> Store</title>
<META name="description" content="<%= WebSiteName %> Store">
<META name="keywords" content="<%= WebSiteName %> Store">
<meta name="author" content="WebArtists.biz">
<link rel="stylesheet" type="text/css" href="Arqstyle.css">

</head>
<BODY border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"   >

<% CustID=request.form("CustID") 
	If Len(CustID) < 1 then
		CustID= Request.QueryString("CustID") 
	End If
	%>
	<!--#Include file="ranchHeader.asp"-->
<table border="0"   cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0" align = "center" width = "600">
	<tr>
		<td class = "body"  valign = "top">
			<table  valign = "top">
				
			<tr>
			  	<td valign = "top">
				<%
					if not rsA.eof And foundimagecount > 1 Then
					%>
<table border="0" cellspacing="0" align = "left" valign = "top" >
			<tr><%	rsA.movefirst
						counter = 0
						counttotal = rsA.recordcount
						counttotal = 8
						'response.write("counttotal=" & 	counttotal)
						While counter < counttotal
			
			counter = counter +1
			If counter = 5 Then
			%>
			</tr>
			<tr><%
			End if
			
			if Len(buttonimages(counter)) > 10  then
			%><td valign = "top" align = "center">
			<font 
			onMouseOver="img<%=counter%>('but1'), this.style.cursor = 'hand'" 
			onMouseOut="img<%=counter%>('but1')"  class = "menu">
			<img src="<%=buttonimages(counter)%>" height = "94" alt = "<%=buttontitle(counter)%>" border = "0">
			<% If Len(buttontitle(counter)) > 1 Then %>
					<br>
					<small><%=buttontitle(counter)%></small></font>
			<% End If %>
			</td>

		<%
			end if
		if counter< counttotal then
			'rsA.movenext
		end if

		%>
			
		<%
	Wend %>
</tr>
			</table>

	<% end if
%>

			</td>
		</tr>
		<tr>
				  <td valign = "top" >
						<% if foundimagecount < 1 then%>
							<table valign = "top" border = "0"   leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 style="border-style: ridge; border-color: #941500 ; border-right-width: 3; border-left-width: 2; border-top-width: 2; border-bottom-width: 3" >
							<tr>
								<td  valign = "top">
									<%=click%>
								</td>
							</tr>
							</table>
						<% else %>
							<table border = "0"  valign = "top" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 style="border-style: ridge; border-color: #941500 ; border-right-width: 3; border-left-width: 2; border-top-width: 2; border-bottom-width: 3" width = "300" >
							<tr>
								<td valign = "top">
									<IMG alt="main image" border=0  name='but1' src="<%=buttonimages(1)%>" align = "center" width = "300">
								</td>
							</tr>
						</table>
						<% end if%>
				</td>
			</tr>
</table>		
	
		</td>
		<td valign = "top">
<!--#Include file="ProdDetailFacts.asp"--> 
		</td>
	</tr>
</table>

<!--#Include file="Additionalproductsinclude.asp"--> 
<!--#Include file="ranchFooter.asp"--> 
</body>
</html>
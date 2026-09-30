<html>
 <head>

 <!--#Include virtual="/GlobalVariables.asp"-->
 <!--#Include virtual="/DetailDBInclude.asp"--> 
<meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
<meta http-equiv="Content-Language" content="en-us">
<title><%= WebSiteName %> Store</title>
<META name="description" content="<%= WebSiteName %> Store">
<META name="keywords" content="<%= WebSiteName %> Store">
<meta name="author" content="The Andresen Group">
<link rel="stylesheet" type="text/css" href="<%=Style%>">

</head>
<BODY border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"   >

 <!--#Include virtual="Header.asp"--> 
<table border="0"   cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0" align = "center" width = "770">
	<tr>
		<td class = "body">
			<table >
				<tr>
				<td valign = "top">
				<%
					if not rsA.eof And foundimagecount > 1 then
						rsA.movefirst
						counter = 0
						counttotal = rsA.recordcount
						counttotal = 8
						'response.write("counttotal=" & 	counttotal) %>
<small> Move your mouse over the images below to enlarge them.</small>
					<%	While counter < counttotal
				%>

		<table border="0" cellspacing="0" align = "center" valign = "top" >
			<tr>
		<% for x= 1 to 1
		    
			 if counter = counttotal then
					exit for
             end if 
			counter = counter +1
			if Len(buttonimages(counter)) > 10  then
			%>
			<td valign = "top" align = "center">
			<font 
			onMouseOver="img<%=counter%>('but1'), this.style.cursor = 'hand'" 
			onMouseOut="img<%=counter%>('but1')"  class = "menu">
			<img src="<%=buttonimages(counter)%>" width = "60" alt = "<%=buttontitle(counter)%>" border = "0">
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
		
				next
		%>
			</tr>
			</table>
		<%
	wend
	end if
%>
</td>
<td valign = "top">
<% if counter < 1 then%>
<table valign = "top" border = "0"   leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0  >
<tr><td><%=click%></td></tr></table>
<% else %>
<table border = "0"  valign = "top" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0  width = "400" height = "600"><tr><td ><IMG alt="main image" border=0  name='but1' src="<%=buttonimages(1)%>" align = "center" width = "400"></td></tr></table>
<% end if%>
</td></tr></table>		
	
		</td>
		<td valign = "top">
<!--#Include file="ProdDetailFacts.asp"--> 
		</td>
	</tr>
</table>
<!--#Include file="Footer.asp"--> 
</body>
</html>
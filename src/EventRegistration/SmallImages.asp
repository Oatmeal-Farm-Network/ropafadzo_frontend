<%
	if not rs.eof then
	rs.movefirst
	counter = 0
	counttotal = 8
	
	While counter < counttotal
	  counter = counter +1
	  'response.write(buttonimages(counter))
	  If Len(buttonimages(counter)) > 11 then
		%>

		<table border="0" cellspacing="0" align = "center" valign = "top" >
			<tr>
			<td valign = "top" align = "center" class = "small">
			<font 
			onMouseOver="img<%=counter%>('but1'), this.style.cursor = 'hand'" 
			onMouseOut="img<%=counter%>('but1')"  class = "menu">
			<img src="<%=buttonimages(counter)%>" width = "70" alt = "<%=buttontitle(counter)%>" border = "0"><br><% If Len(buttontitle(counter)) > 2 Then %>
				<small><%=buttontitle(counter)%></small>
			<% End If %></font>
			</td>

	 <% counter = counter +1 %>

			<td valign = "top" align = "center" class = "small">

			<% If Len(buttonimages(counter)) > 2 then%>
			<font 
			onMouseOver="img<%=counter%>('but1'), this.style.cursor = 'hand'" 
			onMouseOut="img<%=counter%>('but1')"  class = "menu">
			<img src="<%=buttonimages(counter)%>" width = "70" alt = "<%=buttontitle(counter)%>" border = "0"><br>
			<% If Len(buttontitle(counter)) > 2 Then %>
				<small><%=buttontitle(counter)%></small>
			<% End If %>
			</font>
			<% End If %>
			</td>
			</tr>
			</table>
		<% end if
	wend
	end if
%>

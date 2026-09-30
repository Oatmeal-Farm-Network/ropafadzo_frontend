  <table cellpadding = "0" cellspacing = "0" border = "0">
<tr><td valign = "top" class = "body">
<%
	if not rs.eof then
	rs.movefirst
	counter = 0
	counttotal = rs.recordcount
	counttotal = 8
'response.write("counttotal=" & 	counttotal)
	While counter < counttotal
		%>

		<table border="0" cellspacing="0" align = "center" valign = "top" >
			<tr>
		<% for x= 1 to 8
		    
			 if counter = counttotal then
					exit for
             end if 
			counter = counter +1
			if Len(buttonimages(counter)) > 10 and PhotoCount > 1 then
			%>
			<td valign = "top" align = "center">
			<font 
			onMouseOver="img<%=counter%>('but1'), this.style.cursor = 'hand'" 
			onMouseOut="img<%=counter%>('but1')"  class = "menu">
			<img src="<%=buttonimages(counter)%>" width = "70" alt = "<%=buttontitle(counter)%>" border = "0">
			<% If Len(buttontitle(counter)) > 1 Then %>
					<br>
					<small><%=buttontitle(counter)%></small></font>
			<% End If %>
			</td>

		<%
			end if
		if counter< counttotal then
			'rs.movenext
		end if
		
				next
		%>
			</tr>
			</table>
		<%
	wend
	end if
%>
</td></tr>
  <tr><td align = "center">
<% if counter < 1 then%>
<table valign = "top" border = "0"   leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0  ><tr><td><%=click%></td></tr></table>
<% else %>
<table border = "0"  valign = "top" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0  ><tr><td><IMG alt="main image" border=0  name='but1' src="<%=buttonimages(1)%>" align = "center" width = "260"></td></tr></table>
<% end if%>
		</td>
		</tr>
</table>		

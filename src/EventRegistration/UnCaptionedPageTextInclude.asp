	<% If Len(TempImage) > 2  Then %> 		
					<table border="0" cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0" style="padding : 20px;" >
							<tr>
								<td class = "body" valign = "top">
								<h2><%=TempHeading%></h2>
							
										
									<img src = "<%=TempImage%>" width = "<%=TempImagewidth%>" border = "1" align = "<%=TempOrientation%>">
										<%=TempPageText %>
								</td>
							</tr>
						</table>
			<% End If  %>
	
			<% If Len(TempImage) < 2 Then %> 		
					<table>
							<tr>
								<td class = "body" valign = "top">
								<h2><%=TempHeading%></h2>
								<%=TempPageText %>
								</td>
							</tr>
						</table>
			<% End If  %>
	<br>	
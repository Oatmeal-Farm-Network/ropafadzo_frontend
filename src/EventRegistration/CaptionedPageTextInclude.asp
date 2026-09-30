	<% If Len(TempImage) > 2 And TempOrientation = "Right" Then %> 		
					<table  width = "700">
							<tr>
								<td class = "body" valign = "top">
								<h2><%=TempHeading%></h2>
								<%=TempPageText %>
								</td>
								<td align = "center" width = "290" class= "body">
									<img src = "<%=TempImage%>" width = "290" border = "1">
									 <% if Len(TempImageCaption) > 1 Then %>
											<%=TempImageCaption%>
									<% End If %>
								</td>
							</tr>
						</table>
			<% End If  %>
		<% If Len(TempImage) > 2 And TempOrientation = "Left" Then %> 		
					<table  width = "700">
							<tr>
								
								<td align = "center" width = "290" class= "body">
									<img src = "<%=TempImage%>" width = "290" border = "1">
									 <% if Len(TempImageCaption) > 1 Then %>
											<%=TempImageCaption%>
									<% End If %>
								</td>
								<td class = "body" valign = "top">
								<h2><%=TempHeading%></h2>
								<%=TempPageText %>
								</td>
							</tr>
						</table>
			<% End If  %>
			<% If Len(TempImage) < 2 Then %> 		
					<table  width = "700">
							<tr>
								<td class = "body" valign = "top">
								<h2><%=TempHeading%></h2>
								<%=TempPageText %>
								</td>
							</tr>
						</table>
			<% End If  %>

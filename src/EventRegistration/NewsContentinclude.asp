<% If Len(NewsPageText(num)) > 2 then%>
					<% If Len(Image(num)) < 2 then%>
						<table border = "0" bordercolor = "#F6EEE3" bgcolor = "#F6EEE3" cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0" width = "700">
						   <tr>
						    <td class = "body" valign ="top">
								<h2> <%=PageHeading(num)%></h2>
								<%=NewsPageText(num)%>
								</td>
							</tr>
					</table><br><br>
				<% else %>
						<% If ImageOrientation(num) = "Left" then%>
							<table border = "0" bordercolor = "#F6EEE3" bgcolor = "#F6EEE3" cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0" width = "700">
								 <tr>
						           <td class = "body" width = "205" align = "center" valign = "top">
									    <img src = "<%=Image(num)%>" border = "1" width = "200">
									    <% If Len(imageCaption(num)) > 1 Then %>
												<%=imageCaption(num)%>
										<% End If %>
									 </td>
									<td class = "body" valign ="top">
										<h2> <%=PageHeading(num)%></h2>
								<%=NewsPageText(num)%>
								</td>
							</tr>
							</table><br><br>
					   <% Else %>
							<table border = "0" bordercolor = "#F6EEE3" bgcolor = "#F6EEE3" cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0" width = "700">
								 <tr>
						           <td class = "body" valign ="top">
										<h2> <%=PageHeading(num)%></h2>
										<%=NewsPageText(num)%>
									</td>
									<td class = "body" width = "205" align = "center">
									    <img src = "<%=Image(num)%>"  border = "1" width = "200">
									    		    <% If Len(imageCaption(num)) > 1 Then %>
												<%=imageCaption(num)%>
										<% End If %>
									 </td>
							</tr>
							</table><br><br>
						<% End If  %>
				<% End If  %>
				     
				<% End If %>
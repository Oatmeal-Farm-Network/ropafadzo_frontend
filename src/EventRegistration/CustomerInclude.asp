<table cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  align = "center" width = "200" border = "0">
	
	<tr>
		<td class = "body" wrap width = "200">
		<br><br>Owned by<br>
			<b><%=custCompany%></b><br>
				<%=custFirstName%><br>
					<% If Len(custPhone) > 1 Then %>
						Phone 1: 	<%=custPhone%><br>
					<% End If %>
						<% If Len(custphone2) > 1 Then %>
						Phone 2: 	<%=custPhone2%><br>
					<% End If %>
						<% If Len(custFAX) > 1 Then %>
						Phone 1: 	<%=custFAX%><br>
					<% End If %>
					<% If Len(custAddr1) > 1 Then %>
						<%=custAddr1%><br>
						<% If Len(custAddr2) > 1 Then %>
								<%=custAddr2%><br>
						<% End If %>
					<%=custCity%>,&nbsp;<%=custState%>&nbsp;<%=custCountry%>&nbsp;<%=custZip%><br>
					<% End If %>
					<% If Len(custFAX) > 1 Then %>
						Phone 1: 	<%=custFAX%><br>
					<% End If %>
						<% If Len(WebLink) > 1 Then %>
						 <a href = "http://<%=WebLink%>" class = "body" target = "blank">Click Here for Ranch Website</a><br>
					<% End If %>
				 

		</td>
	</tr>
</table>
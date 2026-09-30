


							
				<table  border="0" cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"    valign = "top">
				  <tr>
				  <td width = "10">&nbsp;
				  </td>
					<td class= "body"  valign = "top" colspan = "3" width = "500" align = "center">
						<table  border="0" cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"    valign = "top" width = "480">
						     <tr>
								<td class = "body" colspan = "2" height = "25" valign = "top">
									<big><b><%=Trim(rs("ProdName"))%></b></big>
								</td>
							  <tr>
							  <tr>
								<td class= "body"  valign = "top"  >
								
										<% If Len(rs("ProdPrice")) > 1 Then %>
											Price: <b><%=FormatCurrency(rs("Prodprice"))%></b>
										  <br>
										<% end if %>
										
										<% Prodweight = rs("ProdWeight")
											if Prodweight > 0 Then
													ShippingCost = valBaseRate + (Prodweight-1) * valAddedRate
											Else
											ShippingCost =valdefaultRate
											End If 
										%>
	




									
										<% if len(rs("Materials")) > 2 then%>
					<%=rs("Materials")%><br><br>
				<% end if %>
										
										<% 'ProdQuantityAvailable = rs("ProdQuantityAvailable")
											If Len(ProdQuantityAvailable) > 1  Then %>
												Quantity Available: <%=ProdQuantityAvailable%><br>
											<% End If	%>
											<% ProdSize = rs("ProdSize")
											If Len(ProdSize) > 1  Then %>
												Size: <%=ProdSize%><br>
											<% End If	%>

											
								</td>
								<td class= "body"  valign = "top"  ></td>
							 </tr>
							 <tr>
								<td class = "body" colspan = "2">
									<%=prodDescription %>
								</td>
								</tr>
								<tr>
								<td class = "body" colspan = "2">
									
								
								<form  action="regaddproduct.asp" method="post">
		
						
									<input type="hidden" name="CatID" value="<%=CatID%>">
								<input type="hidden" name="Quantity" size ="2" value = "1">
									<input type="hidden" name="ProdID" size ="2" value = " <%=ID%>">
									<br>

									<input type=submit   border="0" name="submit"  class = "regsubmit2" Value = "Add to Registry" >&nbsp;&nbsp;

								</form> 


				
					 </font>


							

		      </td>
		    </tr>
		  </table>

									

									
									


								</td>
								</tr>
							</table>
						
									
								
								
												

										
						<% ccounter = 1

					

					ProductCounter = 1

				
					%>
		
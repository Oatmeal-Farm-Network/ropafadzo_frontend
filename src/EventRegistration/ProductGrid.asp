
<table border="0" cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0" align = "center" >

<%While Not rs.eof 
			counter = counter +1	%>          
         <tr>
          <%
             for x=1 To 4 %>
			
			<%	  if rs.eof then
					exit for
                 end if 
                alpacaID = rs("Animals.ID")
               'response.write( alpacaID)
               	alpacasPrice= rs("Price")
		Sold 	= rs("Sold")
		SalePending 	= rs("SalePending")
		 photoID = "nophoto"
			If Len(rs("Photo1")) < 2 And Len(rs("Photo2"))< 2  And Len(rs("Photo3")) < 2  And Len(rs("Photo4")) < 2  And Len(rs("Photo5")) < 2 And Len(rs("Photo6")) < 2  And Len(rs("Photo7")) < 2  And Len(rs("Photo8")) < 2 then 
				photoId = "http://www.AlpacaInfinity.com/Uploads/NotAvailable.jpg"
				noimage = true
			Else 
						noimage = false

			End If
			ImageFound = false
			If noimage = False Then
			 
				If Len(rs("Photo1")) > 2 Then
					photoId = rs("Photo1")
					ImageFound = True
					
				End if

				If Len(rs("Photo2")) > 2  And ImageFound = false Then
					photoId = rs("Photo2")
					ImageFound = true
				End if
				
				If Len(rs("Photo3")) > 2  And ImageFound = false Then
					photoId = rs("Photo3")
					ImageFound = true
				End If
				
				If Len(rs("Photo4")) > 2  And ImageFound = false Then
					photoId = rs("Photo4")
					ImageFound = true
				End If
				
				If Len(rs("Photo5")) > 2  And ImageFound = false Then
					photoId = rs("Photo5")
					ImageFound = true
				End If
				
				If Len(rs("Photo6")) > 2  And ImageFound = false Then
					photoId = rs("Photo6")
					ImageFound = true
				End If
				
						If Len(rs("Photo7")) > 2  And ImageFound = false Then
					photoId = rs("Photo7")
					ImageFound = true
				End If
				
						If Len(rs("Photo8")) > 2  And ImageFound = false Then
					photoId = rs("Photo8")
					ImageFound = true
				End If
				
				str1 = photoId
				str2 = "www"
				If Not(InStr(str1,str2) > 0) Then
					photoId = "http://www.AlpacaInfinity.com/Uploads/" & photoId
				End If  

			End If 

	
      

FullPrice =  rs("price")
Discount = (rs("Discount"))
If discount > 1 Then
	DiscountPrice = FullPrice - fullprice*(discount/100)
Else
	DiscountPrice = FullPrice
End if

				%> 
				
			<% Category = "Other" %>
		<td align="center"  valign = "top" class = "list" width = "5">&nbsp;</td>
		<td align="center"  valign = "top" class = "list" ><br>                        
           <table border="0" cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0" height = "130" width = "152" >
				<tr>
					<td align = "center" class = "body"><a href = "Details.asp?ID=<%=alpacaID%>" ><img src = "<%= PhotoID %>" height="100" border = "0"></a>
					</td>
				</tr>
			</table>

	      			<a href = "Details.asp?ID=<%=alpacaID%>" class = "body"><%=Trim(rs("FullName"))%></a><br>
		
								<% If Len(rs("price")) > 2 Then %>
											
												<% If Sold = True Or SalePending = True Then 
												
														If Sold = True Then %>
															<br><font color = "red" size = "8">SOLD</font>
														<% End if %>
														
														<%  If SalePending= True And Sold = False Then %>
														<br><font color = "red" size = "6">Sale<br><br>Pending</font>
												
														<% End if %>


												<% Else %>
												        
												
												Full Price:<%=formatcurrency(Fullprice,0)%><br>
												Discount:<font color ="red"><%=Discount%>%</font><br>
												Discount Price: <font color ="red"><%=formatcurrency(DiscountPrice, 0)%></font><br>
												<% End If %>
									<% End If %>

										<div align = "left">
						
	

				
<br><br>
				</td>
             <% rs.movenext
             next %>
          </tr>
          <%     
         Wend %>
        
       				
		</table>

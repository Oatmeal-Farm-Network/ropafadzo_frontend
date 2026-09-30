
<table border="0" cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0" align = "center" >

  
         <tr>
          <%
                alpacaID = rs("Animals.ID")

				
               'response.write( alpacaID)
               	StudFee= rs("StudFee")
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
					ImageFound = true
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
		<td align="center"  valign = "top" class = "body" width = "2">&nbsp;</td>
		<td align="center"  valign = "top" class = "body" ><br>                        
           <table border="0" cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  width = "200" >
				<tr>
					<td align = "center" class = "body"><a href = "StudDetails.asp?ID=<%=alpacaID%>" ><img src = "<%= PhotoID %>" width="90" border = "0"></a>
					</td>
				</tr>
			</table>

	      			<a href = "StudDetails.asp?ID=<%=alpacaID%>" class = "body"><%=Trim(rs("FullName"))%></a><br>
		
					<% If StudFee > 1 Then %>
							<b>Stud Fee: <%=formatcurrency(StudFee, 0)%></b><br>
					<% End If %>
					
	      			<div align = "right"><a href = "StudDetails.asp?ID=<%=alpacaID%>" class = "body">View Details</a></div><br><br>
		
				</td>
         </tr>
	</table>

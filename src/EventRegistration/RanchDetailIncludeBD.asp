<%While Not rs.eof 
			counter = counter +1	%>  
			<br>
         <table  width = "600">
		 <tr>
          <%
             for x=1 to 1
			 	DueDate	= ""
				BRedTo	= ""
				ExternalStudID	= 0
				ServiceSireID	= 0

				  if rs.eof then
					exit for
                 end if 
                alpacaID = rs("Animals.ID")
               'response.write( alpacaID)
               	alpacasPrice= rs("Price")

		 photoID = "nophoto"
  
        imagelength = len(rs("Photo1"))
		if  imagelength > 5 then
            photoID = rs("Photo1")
		Else
			photoID = "NotAvailable.jpg"
		end If
'response.write("photoID=" & photoID)		
		str1 = photoID
	str2 = "www"
	If Not(InStr(str1,str2) > 0) Then
	       photoID = "http://www.AlpacaInfinity.com/Uploads/" & photoID
	End If  

If Len(rs("ListPageImage")) < 4 then 
	click =  " <form action=""Details.asp"" method=""get"">" &_
                             "<input name=ID type=hidden value=" &  alpacaID & ">" & hiddenInput &_
							  "<input name=DetailType type=hidden value=" & DetailType & ">" &_
                            "<input name=Detail type=image src=""/uploads/NotAvailable.jpg""  border=0  width=""150"" ></form>"
Else
   click =  " <form action=""Details.asp"" method=""get"">" &_
                             "<input name=ID type=hidden value=" &  alpacaID & ">" & hiddenInput &_
							  "<input name=DetailType type=hidden value=" & DetailType & ">" &_
                            "<input name=Detail type=image src=""" & PhotoID &"""  border=0  width=""150"" ></form>"     
End If
%> 
				
<% Category = rs("Category")%>

<td align="center" width = "165" valign = "top" class = "body" rowspan = "2" >                          
  <a href = "Details.asp?ID=<%=alpacaID%>" ><img src = "<%= PhotoID %>" width="100" border = "0" style="border:2px solid black"></a>
	<br>
</td>
<td class= "body"  valign = "top" width = "600" >
		<a href = "Details.asp?ID=<%=alpacaID%>" class = "body"><h2><big><%=Trim(rs("FullName"))%></big></h2></a>
</td>
</tr>
<tr>
	<td class= "body"  valign = "top" >
			<table border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 >

				<%
								SalePending= rs("SalePending")
								Sold = rs("Sold")
							
								If Len(rs("priceComments")) > 2 Then %>
								  <tr>
									<td  class = "Body" colspan ="2"> <b><%=rs("pricecomments")%></b><br></td>
								  </tr>
								 <%End If %>
								 <%If  rs("ShowOnAC") = True Then %>
										<B>Alpaca Champ!</B>                      
								<% End If %>
								<% If Sold = True Then %>
										<tr>
											<td  class = "Body"  colspan = "2" >
													<font color = "red" size = "4">SOLD</font><br>
												</td>
										 </tr>
								<% End if %>
								
								<% If SalePending= True  And Sold = False Then %>
										<tr>
											<td  class = "Body"  colspan = "2" >
													<font color = "red" size = "4">Sale Pending</font><br>
												</td>
										 </tr>
								<% Else %>
								
								
								<%
								  Price = rs("price")
								  Discount = rs("Discount")
								  DiscountPrice = Price - (Price * (Discount/100))
								If Len(rs("price")) > 2 And Sold = False and SalePending = False Then %>
								  <tr>
									<td  class = "Body" >Price:</td>
									<td  class = "Body"  align = "left"><%=formatcurrency(Price,0)%></td>
								  </tr>
									<% If Discount > 5 Then %>
										<tr>
											<td  class = "Body"  colspan = "2">Discount:<b><font color ="red"><%=Discount%>%</font></b>
											</td>
										</tr>
										<tr>
											<td  class = "Body"  colspan = "2">Discount Price: <b><font color ="red"><%=formatcurrency(DiscountPrice, 0)%></font></b>
											</td>
										</tr>
									<% End If %>
							<%End If %>
<%
								  StudFee = rs("StudFee")
					
								If Len(StudFee) > 2 And Sold = False and SalePending = False Then %>
								  <tr>
									<td  class = "Body"  colspan = "2">Stud Fee:<b><%=formatcurrency(StudFee,0)%></b></td>
								  </tr>
							<%End If %>


			<% end if %>


								


										<td valign = "top" class = "body" width = "45">
											Color: <br>
											DOB: <br>
											
											
										</td>
										<td valign = "top" class = "body" width = "300" >
											<%=rs("Color1")%>
											<% if len(rs("Color2")) > 2 Then %>
													/<%=rs("Color2")%>
											<% end if %>
											<% if len(rs("Color3")) > 2 Then %>
													/<%=rs("Color3")%>
											<% end if %>
											<% if len(rs("Color4")) > 2 Then %>
													/<%=rs("Color5")%>
											<% end if %>
						
											<br>
												<%=rs("DOBDay")%>/<%=rs("DOBMonth")%>/<%=rs("DOBYear")%> <br>


											
											
											</td>
										</tr>
										<tr>
												<td valign = "top" class = "body" >Dam:</td>
												<td valign = "top" class = "body" ><%=rs("Dam")%></td>
										</tr>
										<tr>
												<td valign = "top" class = "body" >Sire:</td>
												<td valign = "top" class = "body" ><%=rs("Sire")%></td>
										</tr>


		<tr>
			<td colspan ="2" class = "body" valign = "top" width = "350">
				
				<br><div align = "right"><a href = "Details.asp?ID=<%=alpacaID%>" class = "body">Click here for more information</a></div><br>
				</td>
			</tr>
		</table>
		</form>
		</td>
             <% rs.movenext
             next %>
           </tr>
		  </table>
          <%     
         Wend %>
        
       </form>

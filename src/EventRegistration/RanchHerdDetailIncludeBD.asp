


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
		
		str1 = photoID
	str2 = "www"
	If Not(InStr(str1,str2) > 0) Then
	       photoID = "http://www.AlpacaInfinity.com/Uploads/" & photoID
	End If  
			

'response.write(rs("ListPageImage"))
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

			'If Len(rs("DueDate"))> 1 then
			'	DueDate	=rs("DueDate")
			'	BRedTo	=rs("ServiceSire")
			'	ExternalStudID	=rs("ExternalStudID")
			'	ServiceSireID	=rs("ServiceSireID")
		    'End if
				%> 
				
			<% Category = rs("Category")%>

		<td align="center" width = "165" valign = "top" class = "body" rowspan = "2" >                          
            <table border = "0"   leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 style="border-style: ridge; border-color: #811c35 ; border-right-width: 3; border-left-width: 2; border-top-width: 2; border-bottom-width: 3"  >
			  <tr><td><a href = "Details.asp?ID=<%=alpacaID%>" ><img src = "<%= PhotoID %>" width="100" border = "0"></a></td></tr></table>
			  <br>
		
	       </td>

	     <td class= "body"  valign = "top" width = "600" >
								<a href = "Details.asp?ID=<%=alpacaID%>" class = "body"><h2><big><%=Trim(rs("FullName"))%></big></h2></a>
								
			</td>
			</tr>
			<tr>
				<td class= "body"  valign = "top" >
								<table border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 >
									<tr>
				
								 <%If  rs("ShowOnAC") = True Then %>
										<B>Alpaca Champ!</B>                      
								<% End If %>

			


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
